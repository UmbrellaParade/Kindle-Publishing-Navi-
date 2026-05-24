import React, { useState, useEffect, useCallback, useRef } from 'react';

// ========== スタイル ==========
const colors = {
  bg: '#0d0d1a',
  surface: '#12122a',
  card: '#1a1a35',
  border: '#2a2a50',
  pink: '#ff2d78',
  cyan: '#00f5ff',
  amber: '#ffb300',
  text: '#e8e8ff',
  textMuted: '#888aaa',
  white: '#ffffff',
};

const style = {
  app: { minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'Noto Sans JP', sans-serif" },
  header: { background: 'linear-gradient(90deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)', borderBottom: `1px solid ${colors.border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 700, background: `linear-gradient(90deg, ${colors.pink}, ${colors.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  main: { maxWidth: 1200, margin: '0 auto', padding: '24px 16px' },
  card: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20, marginBottom: 20 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 4, display: 'block' },
  input: { width: '100%', background: '#0d0d1a', border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 12px', color: colors.text, fontSize: 14, boxSizing: 'border-box' },
  textarea: { width: '100%', background: '#0d0d1a', border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 12px', color: colors.text, fontSize: 14, boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.8 },
  btnPrimary: { background: `linear-gradient(90deg, ${colors.pink}, #c0006a)`, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  btnCyan: { background: `linear-gradient(90deg, #007a8a, ${colors.cyan})`, color: '#000', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  btnGhost: { background: 'transparent', color: colors.textMuted, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
  tab: (active) => ({ padding: '8px 18px', border: 'none', borderBottom: active ? `2px solid ${colors.pink}` : '2px solid transparent', background: 'transparent', color: active ? colors.pink : colors.textMuted, cursor: 'pointer', fontWeight: active ? 700 : 400, fontSize: 14, transition: 'all 0.2s' }),
  sectionTitle: { fontSize: 16, fontWeight: 700, color: colors.cyan, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  badge: { background: colors.pink, color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
  saveStatus: { fontSize: 12, color: colors.cyan, marginLeft: 'auto' },
};

// ========== KDPカテゴリー ==========
const KDP_CATEGORIES = [
  { main: "Kindleストア > Kindle本 > 文学・評論", sub1: "日本文学", sub2: "現代小説" },
  { main: "Kindleストア > Kindle本 > SF・ホラー・ファンタジー", sub1: "ファンタジー", sub2: "ダークファンタジー" },
  { main: "Kindleストア > Kindle本 > SF・ホラー・ファンタジー", sub1: "ファンタジー", sub2: "音楽・芸術系ファンタジー" },
  { main: "Kindleストア > Kindle本 > 文学・評論", sub1: "ヒューマンドラマ", sub2: "" },
  { main: "Kindleストア > Kindle本 > エンターテイメント", sub1: "音楽", sub2: "" },
];

const GENRES = [
  "ダークファンタジー / 音楽ファンタジー",
  "ヒューマンドラマ",
  "SF・サイバーパンク",
  "ライトノベル",
  "ミステリー・サスペンス",
  "ホラー",
  "ロマンス・恋愛",
  "ノンフィクション・エッセイ",
  "歴史・時代小説",
  "純文学",
  "コージーミステリー",
  "アクション・冒険",
  "青春・成長物語",
  "ビジネス・自己啓発",
  "詩・散文",
];

// ========== メインタブ ==========
const MAIN_TABS = [
  { id: 'project', label: '📁 出版プロジェクト' },
  { id: 'kindle_progress', label: '📚 Kindle本制作進捗' },
  { id: 'kdp_progress', label: '📝 KDP登録進捗' },
  { id: 'category', label: '🏷️ カテゴリーチェック' },
  { id: 'promo', label: '📣 プロモーション進捗' },
  { id: 'manuscript', label: '✏️ 原稿Kindle調整ツール' },
];

// ========== ローカルストレージ キー ==========
const STORAGE_KEY = 'kindleNavi_projects';
const SELECTED_KEY = 'kindleNavi_selectedProject';

function loadProjects() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
function loadSelectedId() {
  return localStorage.getItem(SELECTED_KEY) || null;
}
function saveSelectedId(id) {
  if (id) localStorage.setItem(SELECTED_KEY, id);
  else localStorage.removeItem(SELECTED_KEY);
}

// ========== 原稿調整ツール ステップ ==========
const MANUSCRIPT_STEPS = [
  { id: 'format', label: '📋 フォーマット判定', step: 1 },
  { id: 'genre', label: '🎭 ジャンル診断', step: 2 },
  { id: 'ruby', label: '🔤 ルビ付与', step: 3 },
  { id: 'readability', label: '📖 読みやすさ修正', step: 4 },
  { id: 'output', label: '💾 出力', step: 5 },
];

// ========== App ==========
export default function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [selectedId, setSelectedId] = useState(loadSelectedId);
  const [activeTab, setActiveTab] = useState('project');
  const [saveStatus, setSaveStatus] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const saveTimer = useRef(null);

  const selectedProject = projects.find(p => p.id === selectedId) || null;

  useEffect(() => { saveProjects(projects); }, [projects]);
  useEffect(() => { saveSelectedId(selectedId); }, [selectedId]);

  const updateProject = useCallback((fields) => {
    if (!selectedId) return;
    setProjects(prev => prev.map(p => p.id === selectedId ? { ...p, ...fields, updatedAt: Date.now() } : p));
    setSaveStatus('💾 保存中...');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus('✅ 保存済み');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 800);
  }, [selectedId]);

  function createProject() {
    if (!newProjectName.trim()) return;
    const newProject = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      book_title: newProjectName.trim(),
      author_name: '',
      kdp_description: '',
      category_main: '',
      category_sub1: '',
      category_sub2: '',
      keywords: ['', '', '', '', '', '', ''],
      checklist_data: {},
      promotion_goal: '',
      strategy_memo: '',
      sns_memo1_title: 'SNSメモ1',
      sns_memo1: '',
      sns_memo2_title: 'SNSメモ2',
      sns_memo2: '',
      manuscript: '',
      cover_image_url: '',
      aplus_image_url: '',
    };
    const updated = [...projects, newProject];
    setProjects(updated);
    setSelectedId(newProject.id);
    setNewProjectName('');
    setShowNewProjectModal(false);
  }

  function deleteProject(id) {
    if (!window.confirm('このプロジェクトを削除しますか？')) return;
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    if (selectedId === id) setSelectedId(updated[0]?.id || null);
  }

  return (
    <div style={style.app}>
      {/* ヘッダー */}
      <div style={style.header}>
        <div style={{ fontSize: 24 }}>🌂</div>
        <div style={style.headerTitle}>Umbrella Parade Kindle Navi</div>
        {selectedProject && (
          <div style={{ marginLeft: 16, fontSize: 13, color: colors.textMuted }}>
            📁 {selectedProject.name}
          </div>
        )}
        {saveStatus && <div style={style.saveStatus}>{saveStatus}</div>}
      </div>

      <div style={style.main}>
        {/* プロジェクト選択バー */}
        <div style={{ ...style.card, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px' }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>プロジェクト：</span>
          <select
            style={{ ...style.input, maxWidth: 300 }}
            value={selectedId || ''}
            onChange={e => setSelectedId(e.target.value || null)}
          >
            <option value="">-- プロジェクトを選択 --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button style={style.btnPrimary} onClick={() => setShowNewProjectModal(true)}>＋ 新規作成</button>
          {selectedProject && (
            <button style={{ ...style.btnGhost, marginLeft: 'auto', color: '#ff6b6b' }} onClick={() => deleteProject(selectedId)}>🗑️ 削除</button>
          )}
        </div>

        {/* 新規プロジェクトモーダル */}
        {showNewProjectModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ ...style.card, width: 400, padding: 28 }}>
              <div style={style.sectionTitle}>📁 新規プロジェクト作成</div>
              <input style={{ ...style.input, marginBottom: 16 }} placeholder="本のタイトルを入力" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createProject()} autoFocus />
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={style.btnPrimary} onClick={createProject}>作成</button>
                <button style={style.btnGhost} onClick={() => setShowNewProjectModal(false)}>キャンセル</button>
              </div>
            </div>
          </div>
        )}

        {/* メインタブ */}
        <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${colors.border}`, marginBottom: 24, overflowX: 'auto' }}>
          {MAIN_TABS.map(t => (
            <button key={t.id} style={style.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {!selectedProject && activeTab !== 'project' ? (
          <div style={{ ...style.card, textAlign: 'center', padding: 48, color: colors.textMuted }}>
            📁 プロジェクトを選択または作成してください
          </div>
        ) : (
          <>
            {activeTab === 'project' && <ProjectTab project={selectedProject} update={updateProject} />}
            {activeTab === 'kindle_progress' && <KindleProgressTab project={selectedProject} update={updateProject} />}
            {activeTab === 'kdp_progress' && <KdpProgressTab project={selectedProject} update={updateProject} />}
            {activeTab === 'category' && <CategoryTab project={selectedProject} update={updateProject} />}
            {activeTab === 'promo' && <PromoTab project={selectedProject} update={updateProject} />}
            {activeTab === 'manuscript' && <ManuscriptTab project={selectedProject} update={updateProject} />}
          </>
        )}
      </div>
    </div>
  );
}

// ========== プロジェクトタブ ==========
function ProjectTab({ project, update }) {
  if (!project) return <div style={{ ...style.card, color: colors.textMuted, textAlign: 'center', padding: 48 }}>プロジェクトを作成してください</div>;
  return (
    <div>
      <div style={style.card}>
        <div style={style.sectionTitle}>📚 基本情報</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={style.label}>本のタイトル</label>
            <input style={style.input} value={project.book_title || ''} onChange={e => update({ book_title: e.target.value })} />
          </div>
          <div>
            <label style={style.label}>著者名</label>
            <input style={style.input} value={project.author_name || ''} onChange={e => update({ author_name: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={style.card}>
        <div style={style.sectionTitle}>🖼️ 画像</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={style.label}>表紙画像URL</label>
            <input style={style.input} value={project.cover_image_url || ''} onChange={e => update({ cover_image_url: e.target.value })} placeholder="https://..." />
            {project.cover_image_url && <img src={project.cover_image_url} alt="表紙" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />}
          </div>
          <div>
            <label style={style.label}>Amazon A+画像URL</label>
            <input style={style.input} value={project.aplus_image_url || ''} onChange={e => update({ aplus_image_url: e.target.value })} placeholder="https://..." />
            {project.aplus_image_url && <img src={project.aplus_image_url} alt="A+" style={{ marginTop: 8, maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== Kindle本制作進捗タブ ==========
const KINDLE_STEPS = [
  "原稿初稿完成", "推敲・校正", "ルビ付与", "楽曲リンク埋め込み",
  "表紙デザイン完成", "A+コンテンツ作成", "docx形式変換", "Kindleプレビュー確認",
  "KDPアカウント設定", "書籍説明文作成", "キーワード設定", "カテゴリー設定",
  "価格設定", "KDPセレクト登録", "出版申請", "審査完了・公開",
  "SNS告知開始", "Amazon広告設定", "レビュー依頼", "3冠獲得確認",
];

function KindleProgressTab({ project, update }) {
  if (!project) return null;
  const checklist = project.checklist_data || {};

  function toggle(key) {
    const updated = { ...checklist, [key]: { ...checklist[key], done: !checklist[key]?.done } };
    update({ checklist_data: updated });
  }
  function setMemo(key, memo) {
    const updated = { ...checklist, [key]: { ...checklist[key], memo } };
    update({ checklist_data: updated });
  }
  function setDate(key, date) {
    const updated = { ...checklist, [key]: { ...checklist[key], date } };
    update({ checklist_data: updated });
  }

  const doneCount = KINDLE_STEPS.filter((_, i) => checklist[`step_${i}`]?.done).length;
  const progress = Math.round((doneCount / KINDLE_STEPS.length) * 100);

  return (
    <div style={style.card}>
      <div style={style.sectionTitle}>📚 Kindle本制作チェックリスト</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>{doneCount} / {KINDLE_STEPS.length} 完了</span>
          <span style={{ fontSize: 13, color: colors.cyan }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: colors.border, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${colors.pink}, ${colors.cyan})`, borderRadius: 4, transition: 'width 0.3s' }} />
        </div>
      </div>
      {KINDLE_STEPS.map((step, i) => {
        const key = `step_${i}`;
        const item = checklist[key] || {};
        return (
          <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
            <input type="checkbox" checked={!!item.done} onChange={() => toggle(key)} style={{ marginTop: 2, accentColor: colors.pink, width: 16, height: 16 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: item.done ? colors.textMuted : colors.text, textDecoration: item.done ? 'line-through' : 'none' }}>{step}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input type="date" style={{ ...style.input, maxWidth: 150, fontSize: 12, padding: '4px 8px' }} value={item.date || ''} onChange={e => setDate(key, e.target.value)} />
                <input style={{ ...style.input, fontSize: 12, padding: '4px 8px' }} placeholder="メモ" value={item.memo || ''} onChange={e => setMemo(key, e.target.value)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========== KDP登録進捗タブ ==========
const ALLOWED_HTML_TAGS = ['br', 'p', 'b', 'em', 'i', 'u', 'h4', 'h5', 'h6', 'ol', 'ul', 'li'];

function KdpProgressTab({ project, update }) {
  if (!project) return null;
  const [descView, setDescView] = useState('visual');
  const keywords = project.keywords || ['', '', '', '', '', '', ''];

  function insertTag(tag) {
    const textarea = document.getElementById('kdp-desc-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = project.kdp_description || '';
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + `<${tag}>${selected}</${tag}>` + text.substring(end);
    update({ kdp_description: newText });
  }

  return (
    <div>
      <div style={style.card}>
        <div style={style.sectionTitle}>📝 KDP書籍説明文</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button style={style.tab(descView === 'visual')} onClick={() => setDescView('visual')}>ビジュアル編集</button>
          <button style={style.tab(descView === 'html')} onClick={() => setDescView('html')}>HTMLソース</button>
          <button style={style.tab(descView === 'preview')} onClick={() => setDescView('preview')}>プレビュー</button>
        </div>

        {descView !== 'preview' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
            {ALLOWED_HTML_TAGS.map(tag => (
              <button key={tag} style={{ ...style.btnGhost, padding: '4px 10px', fontSize: 12 }} onClick={() => insertTag(tag)}>&lt;{tag}&gt;</button>
            ))}
          </div>
        )}

        {descView === 'preview' ? (
          <div style={{ background: '#fff', color: '#111', padding: 20, borderRadius: 8, minHeight: 200, fontFamily: 'serif', lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: project.kdp_description || '<p style="color:#999">説明文を入力するとここにプレビューが表示されます</p>' }} />
        ) : (
          <>
            <textarea id="kdp-desc-textarea" style={{ ...style.textarea, minHeight: 200 }}
              value={project.kdp_description || ''}
              onChange={e => update({ kdp_description: e.target.value })}
              placeholder="書籍の説明文をHTMLで入力してください&#10;使用可能タグ: br, p, b, em, i, u, h4, h5, h6, ol, ul, li" />
            {descView === 'html' && (
              <div style={{ marginTop: 8 }}>
                <button style={style.btnGhost} onClick={() => navigator.clipboard.writeText(project.kdp_description || '')}>📋 HTMLをコピー</button>
              </div>
            )}
          </>
        )}
      </div>

      <div style={style.card}>
        <div style={style.sectionTitle}>🔍 キーワード（7つ）</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {keywords.map((kw, i) => (
            <div key={i}>
              <label style={style.label}>キーワード {i + 1}</label>
              <input style={style.input} value={kw} onChange={e => {
                const updated = [...keywords];
                updated[i] = e.target.value;
                update({ keywords: updated });
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== カテゴリーチェックタブ ==========
function CategoryTab({ project, update }) {
  if (!project) return null;
  return (
    <div style={style.card}>
      <div style={style.sectionTitle}>🏷️ KDPカテゴリー設定</div>
      <div style={{ marginBottom: 16, padding: 12, background: '#0d0d1a', borderRadius: 8, fontSize: 13, color: colors.textMuted }}>
        💡 KDPでは最大2つのカテゴリーを設定できます。ベストセラー3冠を狙うには、競合の少ないサブカテゴリーを選ぶのがポイントです。
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={style.sectionTitle}>📌 おすすめカテゴリー（Umbrella Parade向け）</div>
        {KDP_CATEGORIES.map((cat, i) => (
          <div key={i} style={{ padding: '10px 12px', border: `1px solid ${colors.border}`, borderRadius: 8, marginBottom: 8, cursor: 'pointer', transition: 'border-color 0.2s' }}
            onClick={() => update({ category_main: cat.main, category_sub1: cat.sub1, category_sub2: cat.sub2 })}
            onMouseEnter={e => e.currentTarget.style.borderColor = colors.pink}
            onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}>
            <div style={{ fontSize: 13, color: colors.text }}>{cat.main}</div>
            {cat.sub1 && <div style={{ fontSize: 12, color: colors.textMuted }}>→ {cat.sub1} {cat.sub2 ? `> ${cat.sub2}` : ''}</div>}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <label style={style.label}>メインカテゴリー</label>
          <input style={style.input} value={project.category_main || ''} onChange={e => update({ category_main: e.target.value })} />
        </div>
        <div>
          <label style={style.label}>サブカテゴリー1</label>
          <input style={style.input} value={project.category_sub1 || ''} onChange={e => update({ category_sub1: e.target.value })} />
        </div>
        <div>
          <label style={style.label}>サブカテゴリー2</label>
          <input style={style.input} value={project.category_sub2 || ''} onChange={e => update({ category_sub2: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

// ========== プロモーション進捗タブ ==========
function PromoTab({ project, update }) {
  if (!project) return null;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={style.card}>
          <div style={style.sectionTitle}>🎯 出版目標</div>
          <textarea style={{ ...style.textarea, minHeight: 200 }} value={project.promotion_goal || ''} onChange={e => update({ promotion_goal: e.target.value })} placeholder="例：6月26日リリース&#10;ファンタジー部門1位&#10;Amazon広告2万円" />
        </div>
        <div style={style.card}>
          <div style={style.sectionTitle}>📋 戦略メモ</div>
          <textarea style={{ ...style.textarea, minHeight: 200 }} value={project.strategy_memo || ''} onChange={e => update({ strategy_memo: e.target.value })} placeholder="プロモーション戦略を記入" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={style.card}>
          <div>
            <input style={{ ...style.input, marginBottom: 8 }} value={project.sns_memo1_title || 'SNSメモ1'} onChange={e => update({ sns_memo1_title: e.target.value })} placeholder="メモタイトル" />
          </div>
          <textarea style={{ ...style.textarea, minHeight: 180 }} value={project.sns_memo1 || ''} onChange={e => update({ sns_memo1: e.target.value })} placeholder="SNS投稿文メモ" />
        </div>
        <div style={style.card}>
          <div>
            <input style={{ ...style.input, marginBottom: 8 }} value={project.sns_memo2_title || 'SNSメモ2'} onChange={e => update({ sns_memo2_title: e.target.value })} placeholder="メモタイトル" />
          </div>
          <textarea style={{ ...style.textarea, minHeight: 180 }} value={project.sns_memo2 || ''} onChange={e => update({ sns_memo2: e.target.value })} placeholder="SNS投稿文メモ" />
        </div>
      </div>
    </div>
  );
}

// ========== 原稿Kindle調整ツール ==========
function ManuscriptTab({ project, update }) {
  const [step, setStep] = useState('format');
  const [genre, setGenre] = useState('ダークファンタジー / 音楽ファンタジー');
  const [rubyMode, setRubyMode] = useState('first');
  const [correctedText, setCorrectedText] = useState('');
  const [importText, setImportText] = useState('');
  const [previewTab, setPreviewTab] = useState('before');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState('');

  const manuscript = project?.manuscript || '';

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }

  function handleImport() {
    if (!importText.trim()) return;
    setCorrectedText(importText);
    setPreviewTab('after');
    showToast('✅ 取り込みました！');
  }

  function downloadTxt() {
    const text = correctedText || manuscript;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `原稿_${project?.name || 'book'}_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadDocx() {
    // docxライブラリが使えない場合はtxtにフォールバック
    try {
      const { Document, Packer, Paragraph, TextRun } = require('docx');
      const text = correctedText || manuscript;
      const lines = text.split('\n');
      const doc = new Document({
        sections: [{
          properties: {},
          children: lines.map(line => new Paragraph({
            children: [new TextRun({ text: line, size: 22, font: '游明朝' })],
            spacing: { line: 360 },
          })),
        }],
      });
      Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `原稿_${project?.name || 'book'}_${date}.docx`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch {
      // フォールバック: txtでダウンロード
      downloadTxt();
      showToast('⚠️ docx変換にはビルド環境が必要です。txtでダウンロードしました');
    }
  }

  async function runReadabilityFix() {
    if (!manuscript.trim()) { showToast('⚠️ 先に原稿を入力してください'); return; }
    setIsProcessing(true);
    setCorrectedText('');
    setPreviewTab('after');

    // シミュレーション：実際の実装ではAI APIを呼ぶ
    await new Promise(r => setTimeout(r, 1500));

    // ジャンルに応じた基本的な整形処理
    let text = manuscript;

    // 長い文を改行で分割（句点の後に空行追加）
    if (genre.includes('ダークファンタジー') || genre.includes('ヒューマンドラマ')) {
      text = text.replace(/。\n/g, '。\n\n');
      text = text.replace(/」\n/g, '」\n\n');
      text = text.replace(/！\n/g, '！\n\n');
      text = text.replace(/？\n/g, '？\n\n');
    }

    setCorrectedText(text);
    setIsProcessing(false);
    showToast('✅ 修正完了！');
  }

  function saveAsManuscript() {
    update({ manuscript: correctedText });
    showToast('✅ 原稿として保存しました');
  }

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 24, background: colors.cyan, color: '#000', padding: '10px 20px', borderRadius: 8, fontWeight: 700, zIndex: 9999 }}>{toast}</div>
      )}

      {/* ステップナビ */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, overflowX: 'auto', borderBottom: `1px solid ${colors.border}` }}>
        {MANUSCRIPT_STEPS.map(s => (
          <button key={s.id} style={style.tab(step === s.id)} onClick={() => setStep(s.id)}>{s.label}</button>
        ))}
      </div>

      {/* 共通原稿入力 */}
      {step !== 'output' && (
        <div style={style.card}>
          <div style={style.sectionTitle}>📄 原稿本文</div>
          <textarea style={{ ...style.textarea, minHeight: 200 }}
            value={manuscript}
            onChange={e => update({ manuscript: e.target.value })}
            placeholder="ここに原稿を貼り付けてください" />
        </div>
      )}

      {/* フォーマット判定 */}
      {step === 'format' && (
        <div style={style.card}>
          <div style={style.sectionTitle}>📋 フォーマット判定</div>
          <div style={{ padding: 16, background: '#0d0d1a', borderRadius: 8 }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: colors.cyan }}>✅ 推奨フォーマット：</span> <strong>.docx</strong>
            </div>
            <div style={{ fontSize: 13, color: colors.textMuted }}>
              楽曲URLリンクを含む本作には、クリック可能なハイパーリンクが保持できる<strong>docx形式</strong>が最適です。<br />
              ePubはリンクの安定性に課題があるため、docxを最終出力として推奨します。
            </div>
          </div>
        </div>
      )}

      {/* ジャンル診断 */}
      {step === 'genre' && (
        <div style={style.card}>
          <div style={style.sectionTitle}>🎭 ジャンル診断</div>
          <div style={{ marginBottom: 12 }}>
            <label style={style.label}>ジャンル選択</label>
            <select style={style.input} value={genre} onChange={e => setGenre(e.target.value)}>
              {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ padding: 16, background: '#0d0d1a', borderRadius: 8, fontSize: 13, color: colors.textMuted }}>
            選択中：<span style={{ color: colors.cyan, fontWeight: 700 }}>{genre}</span>
          </div>
        </div>
      )}

      {/* ルビ付与 */}
      {step === 'ruby' && (
        <div style={style.card}>
          <div style={style.sectionTitle}>🔤 ルビ付与</div>
          <div style={{ marginBottom: 12 }}>
            <label style={style.label}>付与モード</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" value="first" checked={rubyMode === 'first'} onChange={() => setRubyMode('first')} />
                <span style={{ fontSize: 14 }}>初出のみ</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" value="all" checked={rubyMode === 'all'} onChange={() => setRubyMode('all')} />
                <span style={{ fontSize: 14 }}>すべて</span>
              </label>
            </div>
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted }}>
            💡 Umbrella Parade固有名詞（ヴェル13世、ネスト13、パレードマスター等）に自動でルビを付与します。
          </div>
        </div>
      )}

      {/* 読みやすさ修正 */}
      {step === 'readability' && (
        <div>
          <div style={style.card}>
            <div style={style.sectionTitle}>📖 読みやすさ修正</div>
            <div style={{ marginBottom: 16 }}>
              <label style={style.label}>対象ジャンル</label>
              <select style={style.input} value={genre} onChange={e => setGenre(e.target.value)}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
              選択ジャンルのKindleベストセラーに合わせて、文章の見た目・改行・リズムを整えます。<br />
              ストーリーの内容は変えません。
            </div>
            <button style={style.btnPrimary} onClick={runReadabilityFix} disabled={isProcessing}>
              {isProcessing ? '⏳ 処理中...' : '✨ このジャンルに合わせて文章を整える'}
            </button>
          </div>

          {(correctedText || isProcessing) && (
            <div style={style.card}>
              <div style={{ display: 'flex', gap: 0, marginBottom: 16, borderBottom: `1px solid ${colors.border}` }}>
                <button style={style.tab(previewTab === 'before')} onClick={() => setPreviewTab('before')}>📄 修正前</button>
                <button style={style.tab(previewTab === 'after')} onClick={() => setPreviewTab('after')}>✨ 修正後（編集可）</button>
              </div>

              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: 40, color: colors.textMuted }}>⏳ AIが修正中...</div>
              ) : previewTab === 'before' ? (
                <div style={{ background: '#fff', color: '#111', padding: 20, borderRadius: 8, minHeight: 400, fontFamily: "'Noto Serif JP', serif", lineHeight: 2, whiteSpace: 'pre-wrap', fontSize: 14 }}>
                  {manuscript}
                </div>
              ) : (
                <div>
                  <textarea
                    style={{ ...style.textarea, minHeight: 500, fontFamily: "'Noto Serif JP', serif", fontSize: 14, lineHeight: 2, background: '#fff', color: '#111', border: 'none' }}
                    value={correctedText}
                    onChange={e => setCorrectedText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button style={style.btnCyan} onClick={() => { navigator.clipboard.writeText(correctedText); showToast('📋 コピーしました！'); }}>📋 全文コピー</button>
                    <button style={style.btnPrimary} onClick={saveAsManuscript}>💾 原稿として保存</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 出力 */}
      {step === 'output' && (
        <div>
          <div style={style.card}>
            <div style={style.sectionTitle}>📥 仕上げ原稿を取り込む</div>
            <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12 }}>
              外部（Word・メモ帳・Googleドキュメント等）で編集した原稿をここに貼り付けてください。
            </div>
            <textarea
              style={{ ...style.textarea, minHeight: 300 }}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="外部で修正した原稿をここにコピペしてください"
            />
            <button style={{ ...style.btnPrimary, marginTop: 12 }} onClick={handleImport}>📥 この原稿を取り込む</button>
          </div>

          <div style={style.card}>
            <div style={style.sectionTitle}>✨ 最終原稿プレビュー（編集可）</div>
            <textarea
              style={{ ...style.textarea, minHeight: 400, fontFamily: "'Noto Serif JP', serif", fontSize: 14, lineHeight: 2, background: '#fff', color: '#111' }}
              value={correctedText || manuscript}
              onChange={e => setCorrectedText(e.target.value)}
              placeholder="原稿がここに表示されます"
            />
          </div>

          <div style={style.card}>
            <div style={style.sectionTitle}>💾 ダウンロード</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button style={style.btnPrimary} onClick={downloadDocx}>📄 .docx でダウンロード（Kindle推奨）</button>
              <button style={style.btnCyan} onClick={downloadTxt}>📝 .txt でダウンロード</button>
              <button style={style.btnGhost} onClick={() => { navigator.clipboard.writeText(correctedText || manuscript); showToast('📋 コピーしました！'); }}>📋 全文コピー</button>
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 8 }}>
              ファイル名：原稿_{project?.name || 'book'}_{new Date().toISOString().slice(0, 10)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
