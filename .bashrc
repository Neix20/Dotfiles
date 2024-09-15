function fortune() {
  # Parameters
  file_path="/home/neix/Documents/fortune.json"
  url="https://raw.githubusercontent.com/Neix20/Dotfiles/main/fortune/data.json"

  # Check if fortune file exists
  if [ ! -f "$file_path" ]; then
    curl -s $url -o $file_path
  fi

  # Return in format "${quote};;; ${author}"
  fortune_data=$(cat $file_path | python -c 'import sys, json, random; data = json.load(sys.stdin); id = random.randint(0, len(data)); print(data[id]["quote"] + ";;; " + data[id]["author"])')

  # Generate Quote and Author
  quote=$(echo "$fortune_data" | awk -F';;; ' '{ print $1 }')
  author=$(echo "$fortune_data" | awk -F';;; ' '{ print $2 }')

  # Color Coding
  NC="\033[1;m"

  quote="\033[1;36m$quote$NC"
  author="\033[1;35m$author$NC"

  output="$quote\\n\\t$author\x1b[0m"

  echo -e $output
}

alias cls="clear"
alias dailyBackup="java -jar ~/Documents/daily-backup.jar"

alias ls='ls --color=auto'
alias grep='grep --color=auto'

NICKNAME="Neix"
echo -ne "Good Morning, $NICKNAME! It's "; date '+%A, %B %-d %Y'
fortune

export EDITOR="vim"
