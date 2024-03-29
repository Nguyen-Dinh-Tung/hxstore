.PHONY: build
build:
	npm i && npm run build $(APP)
start: 
	$(MAKE) build
	pm2 --name hx-$(APP) --time start dist/apps/$(APP)/main.js
restart:
	$(MAKE) build
	pm2 restart hx-$(APP) --update-env