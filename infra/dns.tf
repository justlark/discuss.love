resource "cloudflare_record" "apex_cname" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "CNAME"
  name    = "@"
  content = cloudflare_pages_project.smorgasbord.subdomain
  proxied = true
}

resource "cloudflare_record" "dev_cname" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "CNAME"
  name    = "dev"
  content = "main.${cloudflare_pages_project.smorgasbord.subdomain}"
  proxied = true
}

resource "cloudflare_record" "apex_txt_sl_verification" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "TXT"
  name    = "@"
  content = "sl-verification=bbozlsqmqlrnuufglpzzbqmuruhwvn"
  proxied = false
}

resource "cloudflare_record" "apex_mx" {
  for_each = {
    route1 = {
      content  = "mx1.simplelogin.co."
      priority = 10
    }
    route2 = {
      content  = "mx2.simplelogin.co."
      priority = 20
    }
  }

  zone_id  = data.cloudflare_zone.smorgasbord.id
  type     = "MX"
  name     = "@"
  content  = each.value.content
  priority = each.value.priority
  proxied  = false
}

resource "cloudflare_record" "apex_txt_spf" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "TXT"
  name    = "@"
  content = "v=spf1 include:simplelogin.co ~all"
  proxied = false
}

resource "cloudflare_record" "apex_cname_dkim" {
  for_each = {
    record1 = {
      name    = "dkim._domainkey"
      content = "dkim._domainkey.simplelogin.co."
    }

    record2 = {
      name    = "dkim02._domainkey"
      content = "dkim02._domainkey.simplelogin.co."
    }

    record3 = {
      name    = "dkim03._domainkey"
      content = "dkim03._domainkey.simplelogin.co."
    }
  }

  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "CNAME"
  name    = each.value.name
  content = each.value.content
  proxied = false
}

resource "cloudflare_record" "apex_txt_dmarc" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "TXT"
  name    = "_dmarc"
  content = "v=DMARC1; p=quarantine; pct=100; adkim=s; aspf=s"
  proxied = false
}

resource "cloudflare_record" "umami_cname" {
  zone_id = data.cloudflare_zone.smorgasbord.id
  type    = "CNAME"
  name    = "umami"
  content = "strict-elk.pikapod.net"
  proxied = false
}
