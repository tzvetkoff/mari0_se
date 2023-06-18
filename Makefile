# Variables
VERSION_BASE  = 0.0
VERSION_PATCH = $(shell git rev-list HEAD | wc -l)
VERSION       = $(VERSION_BASE).$(VERSION_PATCH)

##
##@ General
##

## Print this message and exit
.PHONY: help
help:
	@awk '																								\
		BEGIN { 																						\
			printf "\nUsage:\n  make \033[36m<target>\033[0m\n"											\
		}																								\
		END {																							\
			printf "\n"																					\
		}																								\
		/^[0-9A-Za-z-]+:/ {																				\
			if (prev ~ /^## /) {																		\
				printf "  \x1b[36m%-23s\x1b[0m %s\n", substr($$1, 0, length($$1)-1), substr(prev, 3)	\
			}																							\
		}																								\
		/^##@/ {																						\
			printf "\n\033[1m%s\033[0m\n", substr($$0, 5)												\
		}																								\
		!/^\.PHONY/ {																					\
			prev = $$0																					\
		}																								\
	' $(MAKEFILE_LIST)


##
##@ Build
##

## Build
.PHONY: build
build:
	makelove -n $(VERSION)
	mkdir -p ./release/$(VERSION)
	cp ./makelove-build/$(VERSION)/love/mari0_se.love         ./release/$(VERSION)/mari0_se-v$(VERSION).love
	mv ./makelove-build/$(VERSION)/appimage/mari0_se.AppImage ./release/$(VERSION)/mari0_se-v$(VERSION).AppImage
	mv ./makelove-build/$(VERSION)/win32/mari0_se-win32.zip   ./release/$(VERSION)/mari0_se-v$(VERSION)-win32.zip
	mv ./makelove-build/$(VERSION)/win64/mari0_se-win64.zip   ./release/$(VERSION)/mari0_se-v$(VERSION)-win64.zip

## Release
.PHONY: release
release:
	gh release create $(VERSION) ./release/$(VERSION)/*.*

## Clean
.PHONY: clean
clean:
	rm -rf ./makelove-build ./release/$(VERSION)
