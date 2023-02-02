
-- Use a protected call so we don't error out on first use
local status_ok, packer = pcall(require, 'packer')
if not status_ok then
    return
end

return packer.startup(function(use)
    -- Vim Surround Statement with Brackets
    use 'tpope/vim-surround'

    -- Icons
    use 'ryanoasis/vim-devicons'
    use 'kyazdani42/nvim-web-devicons'

    -- Auto Pairs
    use 'jiangmiao/auto-pairs'

    -- Themes
    use 'rakr/vim-one'
    use 'NLKNguyen/papercolor-theme'

    use 'morhetz/gruvbox'

    -- Test Startup Time
    use 'dstein64/vim-startuptime'

    -- Git
    use 'tpope/vim-fugitive'

    -- Auto Format
    use 'vim-autoformat/vim-autoformat'

    -- Tags
    use 'preservim/tagbar'

    -- Snippets
    --use 'SirVer/ultisnips'
    --use 'honza/vim-snippets'
    use "rafamadriz/friendly-snippets"

    -- Tabulate
    use 'godlygeek/tabular'

    -- fzf
    use 'junegunn/fzf'
    use 'junegunn/fzf.vim'

    -- Lua Plugins

    -- Dashboard (start screen)
    use 'goolord/alpha-nvim'
    -- use 'mhinz/vim-startify'

    -- LSP
    use 'neovim/nvim-lspconfig'

    -- Autocomplete
    use {
        'hrsh7th/nvim-cmp',
        requires = {
            'L3MON4D3/LuaSnip',
            'hrsh7th/cmp-nvim-lsp',
            'hrsh7th/cmp-path',
            'hrsh7th/cmp-buffer',
            'saadparwaiz1/cmp_luasnip',
        },
    }

    -- File explorer
    use 'kyazdani42/nvim-tree.lua'
    -- use 'scrooloose/nerdtree'

    -- Statusline
    use 'feline-nvim/feline.nvim'
    -- use 'rbong/vim-crystalline'
    -- use 'nvim-lualine/lualine.nvim'

    -- Treesitter interface
    use {
        'nvim-treesitter/nvim-treesitter',
        run = function() require('nvim-treesitter.install').update({ with_sync = true }) end,
    }

    -- Git AutoComplete
    use {
        "petertriho/cmp-git",
        requires = "nvim-lua/plenary.nvim"
    }

    -- Packer can manage itself
    use 'wbthomason/packer.nvim'

    -- Automatically set up your configuration after cloning packer.nvim
    -- Put this at the end after all plugins
    if packer_bootstrap then
        require('packer').sync()
    end
end)
