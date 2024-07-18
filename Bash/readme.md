
# Notes

## Most Commonly Used Bash Commands

```shell
cd        # Change Directory
cp        # Copy Files
mv        # Move Files
ls        # List Files in Directory
ps        # Check Process
rm        # Remove Files
apt       # Install Packages
cat       # Print Out File
tar       # Archive Files
cron      # Schedule Tasks
curl      # Grab From URL
date      # Show Date
grep      # Fine String
kill      # Kill Process
chmod     # Update Permission of File
mkdir     # Create Directory
rmdir     # Remove Directory
systemctl # Check Service Status
```

## Regex

One Rule to Control All

```shell
s/(.|\n)*?//g
```

## Helpful Scripts

### Insert String by Line Number

```shell
sed -i "$line_num"i"$data" ./index.md
```

### Get Line Number

```shell
grep -n "your_text" filename
```

### AWK Basic Syntax

```shell
awk -F'; ' '{ print $1 }'
```

#### AWK For Loop

```shell
cat ./temp/trash.txt | awk '{ res = ""; split($0, arr, "-"); for (i = 1; i <= 4; i++) res = res arr[i] "-"; res = res arr[i]; print res; }'
```

### Generate Cookie

```shell
dd if=/dev/urandom bs=32 count=1 2>/dev/null | base64 | tr -d -- '\n' | tr -- '+/' '-_'; echo
```

### Use Python To Parse File

```shell
echo '{ "name": "Justin" }' | python -c 'import sys, json; print(json.load(sys.stdin)["name"])'
```

### General Bash Syntax

#### For Loop in Bash

```shell
for ((i=0; i<10; i+=1)); do
  echo $i
done
```

#### Arrays in Bash

```shell
ls=("a" "b" "c")
```

#### For Loop Iteratively

```shell
len="${#ls[@]}"
for ((i=0; i<len; i+=1)); do
  echo "${ls[$i]}"
done
```

#### For Of Loop

```shell
for data in ${ls[@]}; do
  echo $data
done
```

#### Length of Array

```shell
echo "${#ls[@]}"
```

#### Functions in Bash

```shell
function sum() {
  a=$1
  b=$2
  res=$((a+b))
  echo $res
}

sum 3 4
```

### File Archiving

#### Zip Files Together

```shell
tar -cf archive.zip ${fileDirname}
7z a archive.zip ${fileDirname}
```

#### Show List of Files in Archive

```shell
tar -tf archive.zip
7z l archive.zip
```

#### Extract Files

```shell
tar -xf archive.zip
7z x archive.zip
```

### Update Bashrc

#### Windows

```shell
vi ./AppData/Local/Programs/Git/etc/bash.bashrc
```

#### MacOS

```shell
vi ~/.zshrc
vi ~/.bashrc
```

#### Linux

```shell
vi ~/.bashrc
```

### SSH

#### Generate Key Pair

```shell
ssh-keygen -t rsa -b 2048 -f <key-name>.pem
```

#### Copy Public Key to Remote Server

```shell
ssh-copy-id -i <key-name>.pem.pub ubuntu@54.173.100.10
```

#### SSH With Public Key Pair

```shell
ssh -i <key-name>.pem ubuntu@54.173.100.10
```


