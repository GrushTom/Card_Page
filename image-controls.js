/* Random Mage public API controls. Source: https://i.mukyu.ru/docs */
(() => {
    'use strict';
    const base = 'https://i.mukyu.ru';
    const trigger = document.getElementById('image-controls-toggle');
    if (!trigger) return;
    const style = document.createElement('style');
    style.textContent = `
        body.ic-custom-background .bg-container {position:fixed;inset:0;z-index:-1;overflow:hidden}
        body.ic-custom-background .bg-image {position:absolute;inset:0;background-size:cover;background-position:center;transform:scale(1.1)}
        body.ic-custom-background .bg-overlay {position:absolute;inset:0;background:#121212;opacity:.5}
        #image-controls {color:#263047;background:#f8fafc;border:1px solid #cbd5e1;border-radius:20px;padding:0;width:min(940px,calc(100% - 24px));max-height:90dvh;box-shadow:0 24px 80px #0005;}
        #image-controls::backdrop {background:#0f172a99;backdrop-filter:blur(5px)}
        .dark #image-controls {color:#e2e8f0;background:#172033;border-color:#475569}
        #image-controls * {box-sizing:border-box}
        #image-controls header {display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #94a3b844}
        #image-controls h2 {font-size:20px;font-weight:700;margin:0}
        #image-controls p {font-size:13px;line-height:1.6;margin:8px 0;color:inherit;opacity:.8}
        #image-controls .ic-body {padding:20px 24px;display:grid;grid-template-columns:1.1fr 1fr;gap:24px}
        #image-controls .ic-grid {display:grid;grid-template-columns:1fr 1fr;gap:12px}
        #image-controls label {display:flex;flex-direction:column;gap:5px;font-size:13px;margin-bottom:12px}
        #image-controls input,#image-controls select,#image-controls textarea {width:100%;min-width:0;border:1px solid #94a3b866;border-radius:8px;padding:9px;background:#fff;color:#263047;font:inherit}
        .dark #image-controls input,.dark #image-controls select,.dark #image-controls textarea {background:#0f172a;color:#e2e8f0}
        #image-controls button,#image-controls .ic-link {border:1px solid #94a3b866;border-radius:8px;padding:8px 12px;cursor:pointer;font:inherit;font-size:13px;text-decoration:none;color:inherit}
        #image-controls button:disabled {opacity:.45;cursor:default}
        #image-controls .ic-primary {background:#6d28d9;color:white;border-color:#6d28d9}
        #image-controls .ic-actions {display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
        #image-controls summary {cursor:pointer;font-size:14px;padding:8px 0}
        #image-controls .ic-preview {min-height:230px;background:#94a3b818;border:1px dashed #94a3b866;border-radius:12px;display:grid;place-items:center;overflow:hidden;padding:12px}
        #image-controls .ic-preview img {max-width:100%;max-height:380px;object-fit:contain;border-radius:6px}
        #image-controls [hidden] {display:none!important}
        #image-controls :focus-visible {outline:3px solid #a78bfa;outline-offset:2px}
        #image-controls textarea {resize:vertical;font-family:monospace;font-size:12px}
        @media(max-width:640px) {#image-controls .ic-body {grid-template-columns:1fr;padding:16px;gap:16px}#image-controls header {padding:16px}}
    `;
    document.head.append(style);
    const dialog = document.createElement('dialog');
    dialog.id = 'image-controls';
    dialog.setAttribute('aria-labelledby', 'ic-title');
    dialog.innerHTML = `
        <header><div><h2 id="ic-title">图片控件</h2><p>Random Mage · 自由组合筛选，发现喜欢的图片</p></div><button type="button" id="ic-close" aria-label="关闭图片控件">✕</button></header>
        <div class="ic-body"><form id="ic-form">
            <label>出图功能<select name="mode"><option value="random">随机图片 /random</option><option value="feed">批量数据 /feed</option><option value="direct">指定图片 /i/{id}.{ext}</option><option value="wtf">瀑布流 /wtf</option></select></label>
            <fieldset data-modes="direct" hidden disabled class="ic-grid"><label>图库图片 ID<input name="image_id" type="text" inputmode="numeric" pattern="[1-9][0-9]*" required placeholder="例如 628212"></label><label>图片扩展名<select name="ext"><option>jpg</option><option>png</option><option>webp</option><option>gif</option></select></label></fieldset>
            <p data-modes="direct" hidden>使用图库图片 ID（不是 Pixiv 作品 ID），扩展名需与原图一致。</p>
            <fieldset data-modes="random feed wtf">
                <div class="ic-grid">
                    <label>方向<select name="orientation"><option value="any">不限</option><option value="landscape">横图</option><option value="portrait">竖图</option><option value="square">方图</option></select></label>
                    <label>选择策略<select name="strategy"><option value="quality">质量优先</option><option value="random">纯随机</option></select></label>
                    <label>作品类型<select name="illust_type"><option value="any">不限</option><option value="illust">插画</option><option value="manga">漫画</option><option value="ugoira">动图作品</option></select></label>
                    <label>AI 类型<select name="ai_type"><option value="any">不限</option><option value="0">非 AI</option><option value="1">AI</option></select></label>
                    <label>内容范围<select name="r18"><option value="0">全年龄</option><option value="1">R18</option><option value="2">全部</option></select></label>
                    <label>屏幕适配<select name="adaptive"><option value="1">自动适配</option><option value="0">关闭</option></select></label>
                </div>
                <label>包含标签<input name="included_tags" placeholder="风景, 星空|夜空"></label>
                <label>排除标签<input name="excluded_tags" placeholder="用逗号分隔"></label>
                <p>逗号分隔的条件需同时满足；同一条件中用 | 表示任选一个。</p>
                <details><summary>更多筛选 · 分辨率、热度、作者</summary><div class="ic-grid" id="ic-numbers"></div>
                    <div class="ic-grid"><label>发布时间起<input type="date" name="created_from"></label><label>发布时间止<input type="date" name="created_to"></label></div>
                    <label>随机种子<input name="seed" placeholder="选填，用于复现结果"></label>
                    <label>未知分级作品<select name="r18_strict"><option value="1">排除未知分级</option><option value="0">允许未知分级</option></select></label>
                </details>
            </fieldset>
            <fieldset data-modes="random"><div class="ic-grid"><label>返回方式<select name="format"><option value="image">图片预览</option><option value="json">完整 JSON</option><option value="simple_json">精简 JSON</option></select></label><label>稳定地址<select name="redirect"><option value="1">重定向至图片地址</option><option value="0">直接返回图片</option></select></label></div></fieldset>
            <fieldset data-modes="feed" hidden disabled><label>批量数量<input name="limit" type="number" min="1" max="20" value="8" required></label><p>批量接口返回 JSON，可在新窗口查看图片地址列表。</p></fieldset>
            <fieldset data-modes="wtf" hidden disabled><label>浏览布局<select name="view"><option value="masonry">瀑布流</option><option value="tiles">网格</option><option value="single">单张</option></select></label></fieldset>
            <label>图片镜像<select name="proxy"><option value="">自动选择</option><option value="cat">i.pixiv.cat</option><option value="re">i.pixiv.re</option><option value="nl">i.pixiv.nl</option></select></label>
            <details><summary>访问密钥（可选）</summary><label>API Key<input name="api_key" type="password" autocomplete="off" placeholder="仅当服务要求时填写"></label><p>仅在本次页面使用，不保存；生成的链接会包含此密钥。</p></details>
            <div class="ic-actions"><button class="ic-primary" type="submit" id="ic-run">预览 / 换一张</button><button type="reset">重置筛选</button></div>
        </form><section aria-label="图片预览与链接">
            <div class="ic-preview" id="ic-preview"><p>选择筛选条件后，点击预览出图。</p></div>
            <p id="ic-status" role="status" aria-live="polite">尚未请求图片</p>
            <div class="ic-actions"><button type="button" id="ic-background" disabled>设为背景</button><button type="button" id="ic-restore">恢复原背景</button></div>
            <label>当前 API 链接<textarea id="ic-url" rows="5" readonly spellcheck="false"></textarea></label>
            <div class="ic-actions"><button type="button" id="ic-copy">复制链接</button><a class="ic-link" id="ic-open" target="_blank" rel="noopener noreferrer">新窗口打开</a></div>
            <p>背景仅在当前页面生效。筛选过严可能无图；图片加载失败时可更换镜像或放宽条件。</p>
            <div class="ic-actions"><a class="ic-link" href="https://i.mukyu.ru/docs" target="_blank" rel="noopener noreferrer">API 文档</a><a class="ic-link" href="https://i.mukyu.ru/tags" target="_blank" rel="noopener noreferrer">标签列表</a><a class="ic-link" href="https://i.mukyu.ru/authors" target="_blank" rel="noopener noreferrer">作者列表</a><a class="ic-link" href="https://i.mukyu.ru/images" target="_blank" rel="noopener noreferrer">图片列表</a><a class="ic-link" href="https://i.mukyu.ru/status" target="_blank" rel="noopener noreferrer">服务状态</a></div>
        </section></div>`;
    document.body.append(dialog);
    const $ = (selector) => dialog.querySelector(selector);
    const form = $('#ic-form');
    for (const [name, label, min, max] of [
        ['min_width', '最小宽度', 0], ['min_height', '最小高度', 0], ['min_pixels', '最少像素', 0],
        ['min_bookmarks', '最少收藏', 0], ['min_views', '最少浏览', 0], ['min_comments', '最少评论', 0],
        ['user_id', 'Pixiv 作者 ID', 1], ['illust_id', 'Pixiv 作品 ID', 1], ['quality_samples', '质量抽样数', 1, 1000]
    ]) {
        const wrapper = document.createElement('label');
        wrapper.textContent = label;
        const input = document.createElement('input');
        Object.assign(input, {name, type: 'number', min: String(min), step: '1', placeholder: '不限'});
        if (max) input.max = String(max);
        wrapper.append(input);
        $('#ic-numbers').append(wrapper);
    }
    let previewVersion = 0;
    let previewUrl = '';
    let timer;
    const background = document.querySelector('.bg-image');
    const originalBackground = background ? background.style.backgroundImage : '';
    const status = (message) => { $('#ic-status').textContent = message; };
    function buildUrl() {
        const data = new FormData(form);
        const mode = data.get('mode');
        const url = new URL(mode === 'direct' ? `/i/${encodeURIComponent(data.get('image_id') || '')}.${data.get('ext')}` : `/${mode}`, base);
        for (const [key, raw] of data) {
            const value = raw.trim();
            if (!value || ['mode', 'image_id', 'ext'].includes(key)) continue;
            if (key === 'redirect' && data.get('format') !== 'image') continue;
            if (key === 'quality_samples' && data.get('strategy') !== 'quality') continue;
            if (key.endsWith('_tags')) value.split(/[,，\n]+/).map(tag => tag.trim()).filter(Boolean).forEach(tag => url.searchParams.append(key, tag));
            else if (key === 'created_from') url.searchParams.set(key, `${value}T00:00:00Z`);
            else if (key === 'created_to') url.searchParams.set(key, `${value}T23:59:59Z`);
            else url.searchParams.set(key, value);
        }
        return url;
    }
    function update() {
        const mode = form.elements.mode.value;
        dialog.querySelectorAll('[data-modes]').forEach(el => {
            const enabled = el.dataset.modes.split(' ').includes(mode);
            el.hidden = !enabled;
            if (el.tagName === 'FIELDSET') el.disabled = !enabled;
        });
        form.elements.quality_samples.disabled = mode === 'direct' || form.elements.strategy.value !== 'quality';
        const from = form.elements.created_from.value;
        const to = form.elements.created_to.value;
        form.elements.created_to.setCustomValidity(from && to && from > to ? '结束日期不能早于开始日期' : '');
        const url = buildUrl().href;
        $('#ic-url').value = url;
        $('#ic-open').href = url;
        const isImage = mode === 'direct' || (mode === 'random' && form.elements.format.value === 'image');
        $('#ic-run').textContent = isImage ? '预览 / 换一张' : mode === 'wtf' ? '打开瀑布流' : '打开 JSON 数据';
    }
    trigger.addEventListener('click', () => dialog.showModal());
    $('#ic-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => trigger.focus());
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('reset', () => setTimeout(update, 0));
    $('#ic-open').addEventListener('click', event => { if (!form.reportValidity()) event.preventDefault(); });
    form.addEventListener('submit', event => {
        event.preventDefault();
        update();
        const mode = form.elements.mode.value;
        const url = buildUrl();
        if (mode === 'feed' || mode === 'wtf' || (mode === 'random' && form.elements.format.value !== 'image')) {
            window.open(url.href, '_blank', 'noopener,noreferrer');
            status('已在新窗口打开；若浏览器拦截，请点击“新窗口打开”。');
            return;
        }
        const version = ++previewVersion;
        clearTimeout(timer);
        previewUrl = '';
        $('#ic-background').disabled = true;
        if (mode === 'random' && !url.searchParams.has('seed')) url.searchParams.set('seed', `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        const img = new Image();
        img.alt = '按所选条件获取的图片';
        img.referrerPolicy = 'no-referrer';
        const fail = () => {
            if (version !== previewVersion) return;
            clearTimeout(timer);
            img.onload = img.onerror = null;
            img.removeAttribute('src');
            $('#ic-preview').textContent = '图片未能加载';
            status('加载失败或超时：请放宽筛选、更换镜像，或在新窗口检查接口是否需要密钥。');
        };
        img.onload = () => {
            if (version !== previewVersion) return;
            clearTimeout(timer);
            previewUrl = img.src;
            $('#ic-background').disabled = !background;
            status(`加载成功 · ${img.naturalWidth} × ${img.naturalHeight}`);
        };
        img.onerror = fail;
        timer = setTimeout(fail, 45000);
        $('#ic-preview').replaceChildren(img);
        status('正在加载图片…');
        img.src = url.href;
    });
    $('#ic-copy').addEventListener('click', async () => {
        if (!form.reportValidity()) return;
        try { await navigator.clipboard.writeText($('#ic-url').value); status('API 链接已复制。'); }
        catch { $('#ic-url').focus(); $('#ic-url').select(); status('请按 Ctrl+C 或长按复制选中的链接。'); }
    });
    $('#ic-background').addEventListener('click', () => {
        if (background && previewUrl) {
            background.style.backgroundImage = `url(${JSON.stringify(previewUrl)})`;
            document.body.classList.add('ic-custom-background');
            status('已设为当前页面背景。');
        }
    });
    $('#ic-restore').addEventListener('click', () => {
        if (background) background.style.backgroundImage = originalBackground;
        document.body.classList.remove('ic-custom-background');
        status('已恢复原背景。');
    });
    update();
})();
