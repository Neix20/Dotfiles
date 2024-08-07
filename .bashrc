export PATH=/opt/homebrew/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin
alias python="python3"
alias pip="pip3"
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:/Users/justin/WebDriver/geckodriver
alias code='open -a "Visual Studio Code"'

export PYENV_ROOT="$HOME/.pyenv"
command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# My Own Custom
clear

# If not running interactively, don't do anything
[[ "$-" != *i* ]] && return

# Interactive operation...

# Misc :)
# alias less='less -r'                          # raw control characters
# alias whence='type -a'                        # where, of a sort
alias grep='grep --color'                     # show differences in colour
#
# Some shortcuts for different directory listings
alias ls='lsd'
alias dir='lsd'
alias lsd='lsd'

alias home='cd ~'
alias cls="clear"

alias move='mv'
alias copy='cp'

# Custom Location
alias nvimHome='cd ~/.config/nvim'
alias gitCC='git-conventional-commits'

alias clip='xclip -sel clip'

export NICKNAME="Neix"

# Enable Snap Store (For WSL)
# exec sudo nsenter -t $(pidof systemd) -a su - $LOGNAME

# Welcome message
echo -ne "Good Morning, $NICKNAME! It's "; date '+%A, %B %-d %Y'

alias showNet='/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s'
alias cbr='git branch --sort=-committerdate | fzf --header "Checkout Recent Branch" --preview "git diff {1} | delta" | xargs git checkout'

function conNet() {
  networksetup -setairportnetwork en0 "$1" "$2"
}

function title() {
  echo -ne "\033]0;"$*"\007"
}

function git_export_version() {
  ~/BashScript/git_export_all_versions.sh "$1" "$2"
}

function fortune() {
  # Parameters
  file_path="/c/Users/E138807/Documents/fortune.json"
  url="https://raw.githubusercontent.com/Neix20/Dotfiles/master/fortunes/data.json"

  # Check if fortune file exists
  if [ ! -f "$file_path" ]; then
    curl -s $url -o $file_path
  fi

  # Return in format "${quote}; ${author}"
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
