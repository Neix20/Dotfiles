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
alias tf='terraform'
alias k='kubectl'

# Custom Location
alias nvimHome='cd ~/.config/nvim'
alias gitCC='git-conventional-commits'

export NICKNAME="Neix"

# Enable Snap Store (For WSL)
# exec sudo nsenter -t $(pidof systemd) -a su - $LOGNAME

# Welcome message
echo -ne "Good Morning, $NICKNAME! It's "; date '+%A, %B %-d %Y'

alias showNet='/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s'

function conNet() {
  networksetup -setairportnetwork en0 "$1" "$2"
}

function title() {
  echo -ne "\033]0;"$*"\007"
}

function fortune() {
  # Parameters
  file_path="/Users/justin/Documents/fortune.json"
  url="https://raw.githubusercontent.com/Neix20/Dotfiles/master/config/fortune/data.json"

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

function git_export_version() {
  ~/BashScript/git_export_all_versions.sh "$1" "$2"
}

eval export PATH="/Users/justin/.jenv/shims:${PATH}"

export JENV_SHELL=zsh
export JENV_LOADED=1

unset JAVA_HOME
unset JDK_HOME

jenv rehash 2>/dev/null
jenv refresh-plugins
jenv() {
  type typeset &> /dev/null && typeset command
  command="$1"
  if [ "$#" -gt 0 ]; then
    shift
  fi

  case "$command" in
  enable-plugin|rehash|shell|shell-options)
    eval `jenv "sh-$command" "$@"`;;
  *)
    command jenv "$command" "$@";;
  esac
}
export PATH="$HOME/.jenv/bin:$PATH"
eval "$(jenv init -)"

export M2_HOME="/Users/justin/Documents/programs/apache-maven-3.9.8"
export PATH="${M2_HOME}/bin:${PATH}"

# Enable Ctrl-x-e to edit command line
autoload -U edit-command-line
# Emacs style
zle -N edit-command-line

bindkey '^x^e' edit-command-line

export EDITOR="nvim"

alias tailscale='/Applications/Tailscale.app/Contents/MacOS/Tailscale'
alias ts='/Applications/Tailscale.app/Contents/MacOS/Tailscale'

export HOMEBREW_NO_AUTO_UPDATE=1

alias nvim-lazy="NVIM_APPNAME=LazyVim nvim"
alias nvim-snack="NVIM_APPNAME=SnaxVim nvim"

function nvims() {
  items=("default" "SnaxVim" "LazyVim")
  config=$(printf "%s\n" "${items[@]}" | fzf --prompt=" Neovim Config  " --height=~50% --layout=reverse --border --exit-0)
  if [[ -z $config ]]; then
    echo "Nothing selected"
    return 0
  elif [[ $config == "default" ]]; then
    config=""
  fi
  NVIM_APPNAME=$config nvim $@
}

# Fix Docker Build Failes Due to Mac Os
# https://stackoverflow.com/questions/65612411/forcing-docker-to-use-linux-amd64-platform-by-default-on-macos
# export DOCKER_DEFAULT_PLATFORM="linux/amd64"
export PATH="/opt/homebrew/opt/libpq/bin:$PATH"


# Added by LM Studio CLI (lms)
export PATH="$PATH:/Users/justin/.lmstudio/bin"
# End of LM Studio CLI section

export PATH="/Users/justin/.local/bin:$PATH"

# opencode
export PATH=/Users/justin/.opencode/bin:$PATH

# FZF
source <(fzf --zsh)