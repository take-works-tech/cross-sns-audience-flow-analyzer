/**
 * Single source of every user-facing string (ja-JP).
 * Never hardcode UI text in JSX — add it here and read it from `copy`.
 * Wording is lifted verbatim from docs/mockups/ui-mockup.html.
 */
export const copy = {
  /* ---------------------------------------------------------------------- */
  /* shared                                                                  */
  /* ---------------------------------------------------------------------- */
  common: {
    appName: "Flow Analyzer",
    close: "閉じる",
    cancel: "キャンセル",
    reset: "リセット",
    retry: "再取得",
    showAll: "すべて表示",
    people: "人",
    percent: "%",
    observed: "Observed",
    estimated: "Estimated",
    high: "高",
    mid: "中",
    low: "低",
    confidence: "Confidence",
  },

  /* ---------------------------------------------------------------------- */
  /* top bar                                                                 */
  /* ---------------------------------------------------------------------- */
  topBar: {
    searchPlaceholder: "ノード・接続を検索…",
    searchLabel: "検索",
    searchShortcut: "/",
    periodLabel: "期間",
    periods: [
      { value: "7d", label: "7日" },
      { value: "30d", label: "30日" },
      { value: "90d", label: "90日" },
      { value: "custom", label: "カスタム" },
    ],
    defaultPeriod: "30d",
    recalc: "再計算",
    autosave: "自動保存 12:04",
    settings: "設定",
    projectSwitcherLabel: "プロジェクトを切り替え",
    avatarInitials: "YT",
    backToCanvas: "キャンバスへ戻る",
  },

  /* ---------------------------------------------------------------------- */
  /* /login                                                                  */
  /* ---------------------------------------------------------------------- */
  login: {
    headline: ["流入の構造を、", "触って理解する。"],
    sub: "SNSとURLをつないで、オーディエンスの流れをネットワークで可視化します。",
    google: "Google でログイン",
    or: "または",
    emailPlaceholder: "you@example.com",
    emailLabel: "メールアドレス",
    submit: "ログインリンクを送信",
    termsBefore: "続行すると",
    termsLink: "利用規約",
    termsAfter: "に同意したものとみなされます",
  },

  /* ---------------------------------------------------------------------- */
  /* /onboarding                                                             */
  /* ---------------------------------------------------------------------- */
  onboarding: {
    title: "はじめてのプロジェクト",
    sub: "まだノードがありません。3つの方法で分析を始められます。",
    cards: [
      {
        id: "connect",
        title: "SNSアカウントを連携",
        body: "YouTube / Instagram / TikTok / X を接続すると、アカウントと投稿がノードになります。",
      },
      {
        id: "add-url",
        title: "URLを追加",
        body: "商品ページやブログのURLを貼るだけで、流入先ノードを自動生成します。",
      },
      {
        id: "sample",
        title: "サンプルデータで体験",
        body: "架空のクリエイターのデータで、Flowアニメーションと分析を試せます。",
      },
    ],
    footnote: "あとから設定 → 連携管理でいつでも追加できます",
  },

  /* ---------------------------------------------------------------------- */
  /* left panel                                                              */
  /* ---------------------------------------------------------------------- */
  leftPanel: {
    connections: "SNS連携",
    connect: "接続する",
    connected: "接続済み",
    reauth: "要再認証",
    addUrl: "URLを追加",
    urlPlaceholder: "https:// を貼り付け",
    urlLabel: "URL",
    unplaced: "未配置ノード",
    unplacedHint: "キャンバスへドラッグして配置",
    placed: "配置済み",
    filterTemplates: "フィルタテンプレート",
    templates: ["EC導線のみ", "Observedのみ", "高信頼度", "+ 保存"],
  },

  /* ---------------------------------------------------------------------- */
  /* canvas                                                                  */
  /* ---------------------------------------------------------------------- */
  canvas: {
    ariaLabel: "流入ネットワーク図",
    tools: {
      zoomIn: "ズームイン",
      zoomOut: "ズームアウト",
      fit: "全体表示",
      autoLayout: "オートレイアウト",
      multiSelect: "複数選択",
      particles: "Flowアニメーション",
    },
    legend: {
      observed: "Observed（観測流入）",
      estimated: "Estimated（推定流入）",
      scale: "太さ = 流入量 ・ 濃さ = 信頼度",
    },
    recalcPill: "再計算中… 接続を更新しています",
    timeline: {
      play: "期間再生",
      range: "7/30 – 8/29",
    },
    empty: {
      title: "まだノードが配置されていません",
      body: "左のパネルからURLを追加するか、ノードをドラッグしてください",
      cta: "サンプルで試す",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* filter drawer                                                           */
  /* ---------------------------------------------------------------------- */
  filters: {
    title: "表示フィルタ",
    minVolume: "流入人数",
    minVolumeLabel: "流入人数しきい値",
    minRate: "流入率",
    minRateLabel: "流入率しきい値",
    noLimit: "制限なし",
    minConf: "Confidence",
    minConfLabel: "信頼度しきい値",
    flowKindSection: "流入種別",
    observedDesc: "観測された流入",
    estimatedDesc: "推定された流入",
    observedLabel: "Observed表示",
    estimatedLabel: "Estimated表示",
    nodeKindSection: "ノード種別",
    accounts: "アカウント",
    posts: "投稿・動画",
    urls: "URL・商品",
    accountsLabel: "アカウント表示",
    postsLabel: "投稿表示",
    urlsLabel: "URL表示",
    saveTemplate: "テンプレとして保存",
  },

  /* ---------------------------------------------------------------------- */
  /* right panel — ranking                                                   */
  /* ---------------------------------------------------------------------- */
  ranking: {
    title: "流入ランキング",
    directions: [
      { value: "in", label: "流入先" },
      { value: "out", label: "流入元" },
    ],
    trendSection: "トピック別トレンド",
    legendEc: "— EC流入",
    legendAll: "— 全流入",
  },

  /* ---------------------------------------------------------------------- */
  /* right panel — node detail                                               */
  /* ---------------------------------------------------------------------- */
  nodeDetail: {
    metrics: {
      views: "再生数",
      avgWatch: "平均視聴時間",
      inflow: "流入総量（30日）",
      outflow: "流出総量",
    },
    connectionsSection: "主な接続先",
    trendSection: "流入の推移（30日）",
    provenance: "データ更新: 12:04 ・ YouTube Analytics API",
    openOriginal: "元の投稿を開く",
    hide: "非表示",
    kindLabels: {
      youtubeVideo: "YouTube 動画",
      publishedSuffix: " 公開",
    },
  },

  /* ---------------------------------------------------------------------- */
  /* right panel — edge detail                                               */
  /* ---------------------------------------------------------------------- */
  edgeDetail: {
    title: "接続の詳細",
    periodChip: "期間: 30日",
    lagChip: "ラグ中央値 2.1h",
    metrics: {
      volume: "流入人数",
      rate: "流入率（再生比）",
    },
    confidenceHigh: "0.86 — 高",
    confidenceSources: "使用指標: YouTube外部リンククリック ・ UTM ・ 時系列相関",
    trendSection: "流入の推移",
    why: "動画公開後2時間で商品ページへのクリックが通常の6.2倍に増加。概要欄リンクのクリックが主要因です。",
    pin: "固定接続にする",
    cut: "切断",
  },

  /* ---------------------------------------------------------------------- */
  /* /projects                                                               */
  /* ---------------------------------------------------------------------- */
  projects: {
    title: "プロジェクト",
    sub: "分析の単位ごとにキャンバスを保存できます",
    newProject: "新規プロジェクト",
    nodesUnit: "ノード",
    edgesUnit: "接続",
  },

  /* ---------------------------------------------------------------------- */
  /* /settings                                                               */
  /* ---------------------------------------------------------------------- */
  settings: {
    title: "設定",
    sub: "連携・表示・分析の既定値を管理します",
    connections: {
      title: "SNS連携の管理",
      disconnect: "解除",
      reauth: "再認証",
      connect: "接続",
    },
    theme: {
      title: "表示テーマ",
      options: [
        { value: "dark", label: "ダーク（既定）" },
        { value: "light", label: "ライト" },
        { value: "contrast", label: "ハイコントラスト" },
      ],
    },
    animation: {
      title: "アニメーション",
      particles: "Flowアニメーション",
      intensity: "強度",
      intensityDesc: "低スペック環境では自動的に軽量化されます",
      intensityLabel: "アニメーション強度",
      reducedMotion: "OSの視差効果軽減に従う",
      reducedMotionDesc: "prefers-reduced-motion 有効時は静的表示",
      reducedMotionLabel: "reduced-motion連動",
    },
    defaults: {
      title: "分析の既定値",
      minVolume: "流入人数しきい値",
      minConf: "Confidence しきい値",
      refresh: "データ自動更新",
      refreshOptions: [
        { value: "15m", label: "15分" },
        { value: "1h", label: "1時間" },
        { value: "manual", label: "手動" },
      ],
    },
  },

  /* ---------------------------------------------------------------------- */
  /* /dev/states                                                             */
  /* ---------------------------------------------------------------------- */
  states: {
    title: "状態カタログ",
    sub: "実装時に参照するローディング・空・エラー・通知の設計",
    loading: {
      title: "ローディング（スケルトン）",
      note: "スピナーは使わない。キャンバス内はノードのプレースホルダで表現。",
    },
    emptyCanvas: { title: "キャンバス空状態" },
    urlError: {
      title: "URL入力エラー",
      value: "htp://yukifilms",
      message: "URLの形式が正しくありません。「https://」で始めてください。",
    },
    staleBanner: {
      title: "連携切れバナー",
      message:
        "TikTokの認証が期限切れです。@yukifilms のデータは8/24以降更新されていません。",
      action: "再認証する",
    },
    toast: {
      title: "トースト",
      saved: "プロジェクトを保存しました",
      recalcing: "再計算中…",
      recalcingDetail: "14接続を更新",
    },
    metaFail: {
      title: "メタデータ取得失敗（仮ノード）",
      placeholderTitle: "タイトル未取得",
      placeholderUrl: "example-shop.stores.jp/items/…",
    },
    nodeTypes: {
      title: "ノードタイプ一覧",
      labels: [
        "YouTube",
        "Instagram",
        "TikTok",
        "X",
        "商品・EC",
        "一般URL",
      ],
      note: "色は識別の補助。形状（円=SNS / 角丸カード=URL）とアイコンで一次判別する。",
    },
    confidence: { title: "Confidence 表示" },
  },

  /* ---------------------------------------------------------------------- */
  /* modals                                                                  */
  /* ---------------------------------------------------------------------- */
  modals: {
    connect: {
      title: "SNSアカウントを連携",
      warning:
        "TikTokの認証が期限切れです。再認証するまで新しいデータは取得されません。",
      connect: "接続する",
      reauth: "再認証",
      connected: "接続済み",
      note: "連携では読み取り・アナリティクス権限のみを要求します。投稿や書き込みは行いません。トークンは暗号化して保管されます。",
    },
    addUrl: {
      title: "URLからノードを追加",
      sampleValue: "https://yukifilms.shop/products/lens-filter-kit",
      parsed: "解析完了 — 商品ページとして認識しました",
      previewTitle: "Lens Filter Kit — 4枚セット",
      previewMeta: "yukifilms.shop ・ ¥8,900",
      chipProduct: "商品ページ",
      chipOgp: "OGP取得済み",
      destinationSection: "追加先",
      destinations: [
        { value: "staged", label: "未配置リストへ" },
        { value: "canvas", label: "キャンバス中央へ配置" },
      ],
      submit: "ノードを追加",
    },
  },
} as const;

export type Copy = typeof copy;
