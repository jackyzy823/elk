## Note:  patch-commit wil make other dependencies update in lockfile. So we use git to track the change and revert back it.

# after masto >= 0.7 js files aren't combined into a single index.[c|m]js file
docker run -e TAG=$1  --rm -it alpine:latest sh -c '(apk add git nodejs-current pnpm python3 make gcc g++ musl-dev && git clone https://github.com/elk-zone/elk && cd elk  && git checkout $TAG && pnpm i --fix-lockfile  --ignore-scripts  && git add pnpm-lock.yaml  && pnpm patch masto --edit-dir=/fixme && find /fixme -type f -exec sed  -i  s_=\ new\ URL\(path_=\ new\ URL\(path.replace\(/^\\\\//,\ \"\"\)_ {} \; && pnpm  patch-commit /fixme && rm -rf /fixme && git diff > 1.diff && git reset --hard HEAD && git apply --index 1.diff && rm 1.diff && git add patches/masto.patch ) 2> /dev/null 1> /dev/null && cd elk && git diff --cached |cat '

## TODO 
## revert HEAD~1 to drop old patch
# git reset --hard HEAD~1
## rebase to the tag version
# git rebase $1
## apply patch to index and working tree
# git apply --index ./patch.diff
# git commit  with message "patch: modify masto lib for proxy in elk $1"

# in fixes branch do
# git rebase main
# and fix the rebase conflict

# in proxy branch do
# git reset --hard fixes
# git rebase masto_patches
