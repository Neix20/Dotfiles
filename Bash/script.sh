# cat ./temp/trash.txt | awk '{ res = ""; split($0, arr, "-"); for (i = 1; i <= 4; i++) res = res arr[i] "-"; res = res arr[i]; print res; }'

cat ./temp/trash.txt | awk '{ print length($0); }' | pbcopy