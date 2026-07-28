<script>
  import { projectCards } from '$lib/projectCards.js';

  let { labelled = true } = $props();

  function isExternal(url) {
    return /^https?:\/\//.test(url);
  }

  function cropStyle(crop) {
    if (!Array.isArray(crop) || crop.length < 2) return null;
    const from = Number(crop[0]);
    const to = Number(crop[1]);
    if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
    const range = to - from;
    if (range <= 0) return null;
    return { range, translateY: `${(-from * 100).toFixed(2)}%` };
  }

  function imageCrop(node, params) {
    let { range } = params;
    const apply = () => {
      const h = node.offsetHeight;
      if (h > 0 && node.parentElement) node.parentElement.style.height = `${range * h}px`;
    };
    const ro = new ResizeObserver(apply);
    ro.observe(node);
    node.addEventListener('load', apply);
    apply();
    return {
      update(next) { range = next.range; apply(); },
      destroy() {
        ro.disconnect();
        node.removeEventListener('load', apply);
      },
    };
  }
</script>

<div id="projects" class="mx-auto my-5 w-full max-w-3xl px-4">
  {#if labelled}
    <div class="mb-4 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Selected work</p>
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {#each projectCards as project}
      <a
        href={project.url}
        target={isExternal(project.url) ? '_blank' : null}
        rel={isExternal(project.url) ? 'noopener' : null}
        class="group flex flex-col overflow-hidden rounded-xl border-2 border-gray-200 bg-white no-underline shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:shadow-none dark:hover:border-blue-400 dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] {project.featured ? 'lg:col-span-2' : ''}"
      >
        {#if project.image}
          {@const crop = cropStyle(project.crop)}
          {#if crop}
            <div class="w-full overflow-hidden border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
              <img
                src={project.image}
                alt=""
                use:imageCrop={{ range: crop.range }}
                style="--ty: {crop.translateY};"
                class="block w-full translate-y-[var(--ty)] transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
                onerror={(event) => (event.currentTarget.parentElement.style.display = 'none')}
              />
            </div>
          {:else}
            <div class="w-full overflow-hidden border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40 {project.featured ? 'aspect-video' : 'aspect-square'}">
              <img
                src={project.image}
                alt=""
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                loading="lazy"
                onerror={(event) => (event.currentTarget.parentElement.style.display = 'none')}
              />
            </div>
          {/if}
        {/if}
        <div class="flex flex-1 flex-col {project.image ? 'p-3' : 'p-2'}">
          <div class="flex items-start justify-between gap-1">
            <h3 lang={project.lang ?? 'en'} class="min-w-0 hyphens-auto text-base font-bold text-gray-900 [overflow-wrap:break-word] group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
              {project.name}
            </h3>
            {#if !project.image}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400" aria-hidden="true">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            {/if}
          </div>
          <p class="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{project.description}</p>
          {#if project.tags?.length}
            <div class="mt-auto flex flex-wrap gap-1 pt-2">
              {#each project.tags as tag}
                <span class="rounded bg-gray-200 px-1.5 py-1.5 text-[9px] font-medium leading-none text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</div>
