terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.48"
    }
  }

  cloud {
    organization = "lostatc"
    hostname     = "app.terraform.io"

    workspaces {
      name = "smorgasbord"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
