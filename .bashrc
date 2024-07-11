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

fortune_ls=(
  "People aren't born ordinary but they choose to be ordinary; Unknown"
  "We should not give up and we should not allow the problem to defeat us.; A.P.J. Abdul Kalam"
  "Great dreams of great dreamers are always transcended; A.P.J. Abdul Kalam"
  "If you don't build your dream, someone else will hire you to help them build theirs.; Dhirubhai Ambani"
  "Our dreams have to be bigger. Our ambitions higher. Our commitment deeper. And our efforts greater.; Dhirubhai Ambani"
  "Do or do not. There is no try.; Yoda"
  "The most difficult thing is the decision to act, the rest is merely tenacity.; Amelia Earhart"
  "What’s money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.; Bob Dylan"
  "Certain things catch your eye, but pursue only those that capture the heart.; Ancient Indian Proverb"
  "The only person you are destined to become is the person you decide to be.; Ralph Waldo Emerson"
  "If you look at what you have in life, you’ll always have more. If you look at what you don’t have in life, you’ll never have enough.; Oprah Winfrey"
  "I am not a product of my circumstances. I am a product of my decisions.; Steven Covey"
  "The only way to do great work is to love what you do.; Steve Jobs"
  "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.; Winston Churchill"
  "Don’t let yesterday take up too much of today.; Will Rogers"
  "Failure will never overtake me if my determination to succeed is strong enough.; Og Mandino"
  "We may encounter many defeats but we must not be defeated.; Maya Angelou"
  "To see what is right and not do it is a lack of courage.; Confucious"
  "Today’s accomplishments were yesterday’s impossibilities.; Robert H. Schuller"
  "There are no limits to what you can accomplish, except the limits you place on your own thinking.; Brian Tracy"
)

function fortune() {
  # Generate Random Index
  len="${#fortune_ls[@]}"
  len=$((len-1))

  random_ind=$(shuf -i1-$len -n1)

  # Generate Quote and Author
  quote=$(echo "${fortune_ls[$random_ind]}" | awk -F'; ' '{ print $1 }')
  author=$(echo "${fortune_ls[$random_ind]}" | awk -F'; ' '{ print $2 }')

  # Color Coding
  NC="\033[1;m"

  quote="\033[1;36m\"$quote\"$NC"
  author="\033[1;35m--$author$NC"

  output="$quote\\n\\t$author\x1b[0m"

  echo -e $output
}
