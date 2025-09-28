(function () {
  const defaultOptions = {
    text: 'Last updated: {date}',
    format: 'YYYY/MM/DD',
    position: 'bottom',
    placeholder: 'Fetching...',
    branch: 'master',
    path: 'docs',
    repo: null,
    cacheTTL: 6 * 60 * 60 * 1000, // 6 hours
    fallbackText: 'Unknown'
  };

  const CACHE_PREFIX = 'docsify-last-updated:';

  function assign(target, source) {
    if (!source) {
      return target;
    }
    Object.keys(source).forEach(function (key) {
      if (source[key] !== undefined) {
        target[key] = source[key];
      }
    });
    return target;
  }

  function parseRepo(repo) {
    if (!repo) {
      return null;
    }
    let slug = repo.trim();
    if (/github\.com\//i.test(slug)) {
      const match = slug.match(/github\.com\/([^#]+)/i);
      if (match && match[1]) {
        slug = match[1];
      }
    }
    slug = slug.replace(/^https?:\/\//, '').replace(/\.git$/, '');
    const parts = slug.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return parts[0] + '/' + parts[1];
    }
    return null;
  }

  function zeroPad(value) {
    return value.toString().padStart(2, '0');
  }

  function formatDateString(dateInput, format, useUTC) {
    if (!dateInput) {
      return '';
    }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return '';
    }
    const getter = useUTC ? 'getUTC' : 'get';
    const tokens = {
      YYYY: date[getter + 'FullYear'](),
      MM: zeroPad(date[getter + 'Month']() + 1),
      DD: zeroPad(date[getter + 'Date']()),
      HH: zeroPad(date[getter + 'Hours']()),
      mm: zeroPad(date[getter + 'Minutes']()),
      ss: zeroPad(date[getter + 'Seconds']())
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function (token) {
      return tokens[token] !== undefined ? tokens[token] : token;
    });
  }

  function getCache(key, ttl) {
    try {
      const raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) {
        return null;
      }
      const cached = JSON.parse(raw);
      if (!cached || typeof cached !== 'object') {
        return null;
      }
      if (Date.now() - cached.timestamp > ttl) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }
      return cached.value;
    } catch (err) {
      return null;
    }
  }

  function setCache(key, value) {
    try {
      localStorage.setItem(
        CACHE_PREFIX + key,
        JSON.stringify({ value: value, timestamp: Date.now() })
      );
    } catch (err) {
      // Ignore storage errors (quota, private mode, etc.)
    }
  }

  function buildPlaceholder(text, placeholder) {
    const resolved = text.replace('{date}', placeholder);
    return '<p class="last-updated">' + resolved + '</p>';
  }

  function fetchLastCommit(options, repoSlug, filePath) {
    const apiUrl =
      'https://api.github.com/repos/' +
      repoSlug +
      '/commits?path=' +
      encodeURIComponent(filePath) +
      '&sha=' +
      encodeURIComponent(options.branch) +
      '&per_page=1';

    return fetch(apiUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('GitHub API error: ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        if (!Array.isArray(data) || data.length === 0) {
          return null;
        }
        const commit = data[0];
        return (
          commit &&
          commit.commit &&
          commit.commit.committer &&
          commit.commit.committer.date
        )
          ? commit.commit.committer.date
          : null;
      });
  }

  function updatePlaceholder(element, text, value) {
    if (!element) {
      return;
    }
    element.textContent = text.replace('{date}', value);
  }

  window.$docsify = window.$docsify || {};

  window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    const options = assign({}, defaultOptions);
    assign(options, window.$docsify.lastUpdated);

    const repoSlug = parseRepo(options.repo || vm.config.repo);
    const docsPath = options.path ? options.path.replace(/\/$/, '') : '';
    const useUTC = options.useUTC !== false; // default true

    hook.afterEach(function (html, next) {
      const placeholder = buildPlaceholder(options.text, options.placeholder);
      if (String(options.position).toLowerCase() === 'top') {
        next(placeholder + '\n\n' + html);
      } else {
        next(html + '\n\n' + placeholder);
      }
    });

    hook.doneEach(function () {
      const container = document.querySelector('.last-updated');
      if (!container) {
        return;
      }

      const file = vm.route.file || vm.config.homepage || 'README.md';
      const routeAtFetch = vm.route.path;
      const templateText = options.text;

      if (!repoSlug) {
        const fallback = formatDateString(document.lastModified, options.format, useUTC);
        updatePlaceholder(container, templateText, fallback || options.fallbackText);
        return;
      }

      const normalizedPath = docsPath ? docsPath + '/' + file : file;
      const cacheKey = repoSlug + '|' + options.branch + '|' + normalizedPath;
      const cachedValue = getCache(cacheKey, options.cacheTTL);

      if (cachedValue) {
        const formatted = formatDateString(cachedValue, options.format, useUTC) || options.fallbackText;
        updatePlaceholder(container, templateText, formatted);
        return;
      }

      updatePlaceholder(container, templateText, options.placeholder);

      fetchLastCommit(options, repoSlug, normalizedPath)
        .then(function (dateString) {
          if (routeAtFetch !== vm.route.path) {
            return;
          }
          if (!dateString) {
            updatePlaceholder(container, templateText, options.fallbackText);
            return;
          }
          setCache(cacheKey, dateString);
          const formatted =
            formatDateString(dateString, options.format, useUTC) || options.fallbackText;
          updatePlaceholder(container, templateText, formatted);
        })
        .catch(function () {
          if (routeAtFetch !== vm.route.path) {
            return;
          }
          const fallback = formatDateString(document.lastModified, options.format, useUTC);
          updatePlaceholder(container, templateText, fallback || options.fallbackText);
        });
    });
  });
})();
