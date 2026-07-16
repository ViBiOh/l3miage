-- Rewrite image sources to match the runtime path served by viws:
-- `img/foo.png` -> `/doc/img/foo.png?v={{version}}`
-- The `{{version}}` token is substituted in CI by `sed`.

function Image(el)
  local src = el.src

  if src:match("^https?://") or src:match("^/") then
    return el
  end

  el.src = "/doc/" .. src .. "?v={{version}}"
  return el
end
