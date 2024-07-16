resource "cloudflare_ruleset" "origin_cache_control" {
  zone_id     = data.cloudflare_zone.smorgasbord.id
  name        = "Origin cache control"
  description = "Respect Cache-Control headers from the origin"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  rules {
    action = "set_cache_settings"

    action_parameters {
      browser_ttl {
        mode = "respect_origin"
      }
      respect_strong_etags = true
    }

    expression  = "(http.host eq \"${data.cloudflare_zone.smorgasbord.name}\")"
    description = "Respect Cache-Control headers from the origin"
    enabled     = true
  }
}
