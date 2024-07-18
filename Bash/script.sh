cat ./temp/trash.txt | awk '{ split($0, arr, "-"); res = arr[1]; for (i = 2; i <= 5; i++) res = res "-" arr[i]; print res; }'

# cat ./temp/trash.txt | awk '{ print length($0); }' | pbcopy