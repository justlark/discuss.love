terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.36.0"
    }
  }

  cloud {
    organization = "justlark"
    hostname     = "app.terraform.io"

    workspaces {
      name = "smorgasbord"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
