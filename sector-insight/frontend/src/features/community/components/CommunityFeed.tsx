"use client"

import React, { useState } from "react"
import { CommunityPost, SentimentTag, SortOrder } from "../types"
import { createCommunityPost, voteCommunityPost } from "../services/communityApi"
import { sanitizeTextInput, sanitizeTicker } from "@/src/shared/lib/security"

interface CommunityFeedProps {
  initialPosts: CommunityPost[]
  ticker?: string
}

export function CommunityFeed({ initialPosts, ticker }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)
  const [activeSort, setActiveSort] = useState<SortOrder>("hot")
  const [userVotes, setUserVotes] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newSentiment, setNewSentiment] = useState<SentimentTag>("BULLISH")
  const [newTicker, setNewTicker] = useState(ticker || "BBRI")

  const handleVote = async (postId: number, direction: 1 | -1) => {
    const currentVote = userVotes[postId] || 0
    const nextDirection = currentVote === direction ? 0 : direction

    setUserVotes((prev) => ({ ...prev, [postId]: nextDirection }))
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const deltaUp = nextDirection === 1 ? 1 : currentVote === 1 ? -1 : 0
        const deltaDown = nextDirection === -1 ? 1 : currentVote === -1 ? -1 : 0
        return {
          ...p,
          upvotes: Math.max(0, p.upvotes + deltaUp),
          downvotes: Math.max(0, p.downvotes + deltaDown),
          weighted_score: p.weighted_score + (nextDirection - currentVote),
        }
      })
    )

    try {
      await voteCommunityPost(postId, nextDirection as 1 | -1 | 0, "ritel_aktif")
    } catch (err) {
      console.warn("Vote error:", err)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanTitle = sanitizeTextInput(newTitle, 150)
    const cleanContent = sanitizeTextInput(newContent, 2000)
    const cleanTicker = sanitizeTicker(newTicker) || "BBRI"
    if (!cleanTitle.trim() || !cleanContent.trim()) return

    setIsSubmitting(true)
    try {
      const created = await createCommunityPost({
        ticker: cleanTicker,
        title: cleanTitle,
        content: cleanContent,
        sentiment_tag: newSentiment,
        username: "ritel_analis",
      })
      setPosts([created, ...posts])
      setNewTitle("")
      setNewContent("")
      setShowCreateForm(false)
    } catch {
      alert("Gagal mempublikasikan postingan. Pastikan form terisi lengkap.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    if (activeSort === "top") return b.weighted_score - a.weighted_score
    if (activeSort === "new")
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (activeSort === "controversial") {
      const ratioA = a.downvotes / (a.upvotes + 1)
      const ratioB = b.downvotes / (b.upvotes + 1)
      return ratioB - ratioA
    }
    return b.hot_rank - a.hot_rank
  })

  return (
    <div className="flex flex-col gap-space-md w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-surface-card rounded-xl border border-border-subtle shadow-sm">
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-lg border border-border-subtle/50">
          {(["hot", "top", "new", "controversial"] as SortOrder[]).map((sort) => (
            <button
              key={sort}
              type="button"
              onClick={() => setActiveSort(sort)}
              className={`px-3 py-1.5 rounded-md text-caption font-semibold capitalize transition-all ${
                activeSort === sort
                  ? "bg-brand-red text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {sort === "hot" ? "🔥 Hot" : sort === "top" ? "🏆 Top" : sort === "new" ? "⚡ New" : "⚔️ Controversial"}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg text-caption font-semibold transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>{showCreateForm ? "Tutup Form" : "Tulis Analisis Baru"}</span>
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreatePost}
          className="p-space-lg bg-surface-card rounded-xl border border-brand-red/40 flex flex-col gap-3 shadow-md animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <h4 className="font-title-md text-title-md font-bold text-text-primary">
              Mulai Diskusi & Analisis Komunitas
            </h4>
            <span className="text-caption text-text-secondary">
              Anti-PomPom: Suara dibobotkan oleh skor kredibilitas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-caption font-semibold text-text-secondary block mb-1">
                Saham Ticker
              </label>
              <input
                type="text"
                value={newTicker}
                maxLength={6}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                placeholder="Contoh: BBRI, BBCA"
                className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-sm text-text-primary uppercase font-mono"
                required
              />
            </div>
            <div>
              <label className="text-caption font-semibold text-text-secondary block mb-1">
                Sentimen Analisis
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["BULLISH", "BEARISH", "NEUTRAL"] as SentimentTag[]).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setNewSentiment(tag)}
                    className={`py-2 px-2 text-caption font-bold rounded-lg border text-center transition-colors ${
                      newSentiment === tag
                        ? tag === "BULLISH"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                          : tag === "BEARISH"
                          ? "bg-rose-500/20 text-rose-400 border-rose-500"
                          : "bg-surface-container-high text-text-primary border-border-subtle"
                        : "bg-surface-container-lowest text-text-secondary border-border-subtle/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-caption font-semibold text-text-secondary block mb-1">
              Judul Argumen
            </label>
            <input
              type="text"
              value={newTitle}
              maxLength={150}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Sebutkan tesis utama investasi Anda..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-sm text-text-primary"
              required
            />
          </div>

          <div>
            <label className="text-caption font-semibold text-text-secondary block mb-1">
              Rincian Analisis (Fakta, Rasio Keuangan, atau Arus Dana)
            </label>
            <textarea
              rows={3}
              value={newContent}
              maxLength={2000}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Tuliskan analisis mendalam tanpa klaim pom-pom atau ajakan spekulatif..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-border-subtle rounded-lg text-body-sm text-text-primary"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-surface-container-high text-text-secondary rounded-lg text-caption font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-brand-red text-white rounded-lg text-caption font-semibold hover:bg-brand-red/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Analisis"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {sortedPosts.length === 0 ? (
          <div className="p-space-xl bg-surface-card rounded-xl border border-border-subtle text-center text-text-secondary">
            Belum ada diskusi untuk filter ini. Jadilah yang pertama memberikan analisis!
          </div>
        ) : (
          sortedPosts.map((post) => {
            const userVote = userVotes[post.id] || 0
            const isBullish = post.sentiment_tag === "BULLISH"
            const isBearish = post.sentiment_tag === "BEARISH"

            return (
              <div
                key={post.id}
                className="bg-surface-card rounded-xl border border-border-subtle p-space-md flex gap-3 hover:border-border-subtle/80 transition-all shadow-sm"
              >
                <div className="flex flex-col items-center justify-start bg-surface-container-lowest/80 p-1.5 rounded-lg border border-border-subtle/40 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleVote(post.id, 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                      userVote === 1
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-text-secondary hover:text-emerald-400"
                    }`}
                    title="Upvote berbobot reputasi"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>

                  <span
                    className={`font-mono text-caption font-bold my-1 ${
                      post.weighted_score > 0
                        ? "text-emerald-400"
                        : post.weighted_score < 0
                        ? "text-rose-400"
                        : "text-text-secondary"
                    }`}
                  >
                    {Math.round(post.weighted_score)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleVote(post.id, -1)}
                    className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                      userVote === -1
                        ? "bg-rose-500/20 text-rose-400"
                        : "text-text-secondary hover:text-rose-400"
                    }`}
                    title="Downvote anti-pompom"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      keyboard_arrow_down
                    </span>
                  </button>
                </div>

                <div className="flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-caption text-text-secondary mb-1">
                      <span className="font-mono font-bold text-text-primary px-1.5 py-0.2 bg-surface-container-lowest rounded border border-border-subtle/50">
                        ${post.ticker}
                      </span>
                      <span className="font-semibold text-text-primary">@{post.username}</span>
                      <span className="px-1.5 py-0.2 text-[10px] rounded bg-surface-container-high text-brand-red font-medium">
                        ★ {post.user_badge} ({post.user_karma} Karma)
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <span
                        className={`ml-auto px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          isBullish
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : isBearish
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                            : "bg-surface-container-high text-text-secondary border border-border-subtle"
                        }`}
                      >
                        [{post.sentiment_tag}]
                      </span>
                    </div>

                    <h4 className="font-title-md text-title-md font-bold text-text-primary leading-snug">
                      {post.title}
                    </h4>

                    <p className="font-body text-body-sm text-text-primary/90 mt-1 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-caption text-text-secondary pt-2 border-t border-border-subtle/40">
                    <span className="flex items-center gap-1 hover:text-text-primary cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span>{post.comment_count} Komentar</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-text-primary cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      <span>Bagikan</span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400/80 ml-auto text-[11px]">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>Terverifikasi Anti-Spam</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
