
"------------------DEFAULT SETTINGS------------------
ru! defaults.vim                " Use Enhanced Vim defaults
set mouse=                      " Reset the mouse setting from defaults
aug vimStartup | au! | aug END  " Revert last positioned jump, as it is defined below
let g:skip_defaults_vim = 1     " Do not source defaults.vim again (after loading this system vimrc)

"------------------SETTINGS------------------

" set auto-indenting on for programming
  set ai

" set clipboard to unnamed to access the system clipboard under windows
  set clipboard=unnamed 

" Disable compatibility with vi which can cause unexpected issues.
  set nocompatible

" Disable the vim bell
  set vb

" Disable auto commenting in a new line
  autocmd Filetype * setlocal formatoptions-=c formatoptions-=r  formatoptions-=o

" Setting the character encoding of Vim to UTF-8
  set encoding=UTF-8

" Enable type file detection. Vim will be able to try to detect the type of file is use.
  filetype on

" Smart tab
  set smarttab

" Fold Method
  set foldmethod=indent

" Search down to subfolders
  set path+=**

" Enable plugins and load plugin for the detected file type.
  filetype plugin on

" Load an indent file for the detected file type.
  filetype indent on

" Turn syntax highlighting on.
  syntax on

" Add numbers to the file.
  set number relativenumber

" Mouse functionality
  set mouse=a

" Highlight cursor line underneath the cursor horizontally.
  set cursorline

" Set shift width to 4 spaces.Set tab width to 4 columns.
  set shiftwidth=2
  set tabstop=2

" If the current file type is HTML, set indentation to 2 spaces.
  autocmd Filetype html setlocal tabstop=2 shiftwidth=2 expandtab

" Do not save backup files.
  set nobackup

" Do wrap lines.
  set wrap

" While searching though a file incrementally highlight matching characters as you type.
  set incsearch
  set hlsearch

" Ignore capital letters during search.
  set ignorecase

" Show partial command you type in the last line of the screen.
  set showcmd

" Show the mode you are on the last line.
  set showmode

" Set TermGuiColors
  set termguicolors

" ColorScheme
  colorscheme neixone

" Show matching words during a search.
  set showmatch

" Set the commands to save in history default number is 20.
  set history=1000

" Setting the split window to open as i like (like in a WM - qtile)
  set splitbelow splitright

" Enable auto completion menu after pressing TAB.
  set wildmenu

" There are certain files that we would never want to edit with Vim.
" Wild menu will ignore files with these extensions.
  set wildignore=*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx

" Better command line completion
  set wildmode=list:longest,longest:full

" If Vim version is equal to or greater than 7.3 enable undo file.
" This allows you to undo changes to a file even after saving it.
  if version >= 703
      set undodir=~/.vim/backup
      set undofile
      set undoreload=10000
  endif

" File Browsing settings
  let g:netrw_banner=0
  let g:netrw_liststyle=3
  let g:netrw_showhide=1
  let g:netrw_winsize=20


" Auto Completion - Enable Omni complete features
  set omnifunc=syntaxcomplete#Complete
  

" Enable Spelling Suggestions for Auto-Completion:
  set complete+=k
  set completeopt=menu,menuone,noinsert


" Minimalist-Tab Complete
  inoremap <expr> <Tab> TabComplete()
  fun! TabComplete()
      if getline('.')[col('.') - 2] =~ '\K' || pumvisible()
          return "\<C-N>"
      else
          return "\<Tab>"
      endif
  endfun
  

" Minimalist-Autocomplete 
  inoremap <expr> <CR> pumvisible() ? "\<C-Y>" : "\<CR>"
  autocmd InsertCharPre * call AutoComplete()
  fun! AutoComplete()
      if v:char =~ '\K'
          \ && getline('.')[col('.') - 4] !~ '\K'
          \ && getline('.')[col('.') - 3] =~ '\K'
          \ && getline('.')[col('.') - 2] =~ '\K' " last char
          \ && getline('.')[col('.') - 1] !~ '\K'
  
          call feedkeys("\<C-N>", 'n')
      end
  endfun


" Closing compaction in insert mode
  inoremap [ []<left>
  inoremap ( ()<left>
  inoremap { {}<left>
  inoremap /* /**/<left><left>

"------------------Hex_Toggle_Functions------------------

function! DoHex()
    " Get the current buffer name
    let current_file = expand('%')

    " New file name
  let new_file = current_file . '.hex'

    " Save the current buffer as a hex file
    execute 'w !xxd > ' . new_file

    echo "Hex file created and saved as " . new_file
endfunction

function! UndoHex()
    " Get the current buffer name
    let current_file = expand('%')

  " Name stage 1: Remove the .hex extension if it exists
    let new_file_stage1 = substitute(current_file, '\.hex$', '', '')

  " Get the file name without extension
  let file_name = substitute(new_file_stage1, '\(.*\)\.\(\w\+\)$', '\1', '')

  " Get the file extension
  let file_extension = substitute(new_file_stage1, '\(.*\)\.\(\w\+\)$', '\2', '')

  " Add 'M' before the extension(M = Modded)
  let new_file = file_name . 'M.' . file_extension

    " Save the current buffer as a reversed hex file
    execute 'w !xxd -r > ' . new_file

    echo "Reversed Hex file created and saved as " . new_file
endfunction

" Function to toggle between hex and original states
function! HexState()
    " Get user input to choose the operation (0 for DoHex, 1 for UndoHex)
    let operation = input("Choose operation (0 for DoHex, 1 for UndoHex): ")

    if operation == 0
        " Execute the DoHex function
        call DoHex()
    elseif operation == 1
        " Execute the UndoHex function
        call UndoHex()
    else
        echo "Invalid choice. Aborting."
    endif
endfunction

"------------------Hebrew_Toggle_Function------------------

function! ToggleHebrew()
  if &rl
    set norl
    set keymap=
    set spell
    echom "Hebrew mode OFF"
  else
    set rl
    set keymap=hebrew
    set nospell
    echom "Hebrew mod ON"
  endif
endfunction


"------------------STATUS_LINE------------------

" default the statusline to green when entering Vim
hi mainBar ctermbg=green ctermfg=black guibg=green guifg=black

" statusline
set laststatus=2

set statusline=                          " left align
set statusline+=%#mainBar#\                     " blank char
set statusline+=%#mainBar#\%{StatuslineMode()}
set statusline+=%#mainBar#\ 
set statusline+=%#secondaryBar#\ <<
set statusline+=%#secondaryBar#\ %f                  " short filename              
set statusline+=%#secondaryBar#\ >>
set statusline+=%=                       " right align
set statusline+=%{strftime(\"%H:%M\")}\ 
set statusline+=%#mainBar#\ %h%m%r               " file flags (help, read-only, modified)
set statusline+=%#mainBar#%{b:gitbranch}       " include git branch
set statusline+=%#mainBar#%l/%L              " line count
set statusline+=%#mainBar#\ %y\                    " file type
hi secondaryBar ctermbg=black ctermfg=white guibg=black guifg=white

" statusline functions
function! StatuslineMode()
    let l:mode=mode()
    if l:mode==?"n"
    hi mainBar ctermbg=green ctermfg=black guibg=green guifg=black
        return "NORMAL"
    elseif l:mode==#"v"
    hi mainBar ctermbg=red ctermfg=white guibg=red guifg=white
        return "VISUAL"
    elseif l:mode==#"i"
    hi mainBar ctermbg=blue ctermfg=white guibg=blue guifg=white
        return "INSERT"
    elseif l:mode==#"c"
    hi mainBar ctermbg=yellow ctermfg=black guibg=yellow guifg=black
        return "COMMAND"
    endif
endfunction

function! StatuslineGitBranch()
  let b:gitbranch=""
  if &modifiable
    try
      lcd %:p:h
    catch
      return
    endtry
    let l:gitrevparse=system("git rev-parse --abbrev-ref HEAD")
    lcd -
    if l:gitrevparse!~"fatal: not a git repository"
      let b:gitbranch="(".substitute(l:gitrevparse, '\n', '', 'g').") "
    endif
  endif
endfunction

augroup GetGitBranch
  autocmd!
  autocmd VimEnter,WinEnter,BufEnter * call StatuslineGitBranch()
augroup END
"------------------END_KEY------------------
