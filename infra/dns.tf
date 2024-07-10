resource "cloudflare_record" "apex_cname" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "CNAME"
  name    = "@"
  value   = "smorgasbord.pages.dev"
  proxied = true
}
