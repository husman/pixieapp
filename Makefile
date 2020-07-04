build-mac: ## CI: Builds and deploys a release for Windows and Linux
	yarn package-mac
	./scripts/plist.sh

release-win-linux: ## Dev: Builds and deploys a release for Windows and Linux
	docker-compose -f docker-compose.yml -f docker-compose-dev.yml run --rm app scripts/release-win-linux.sh

release-win-linux-ci: ## CI: Builds and deploys a release for Windows and Linux
	docker-compose run --rm app scripts/release-win-linux.sh

clean: ## Releases the Docker resources
	docker-compose down -v

.PHONY: help

help: ## Displays this menu
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
