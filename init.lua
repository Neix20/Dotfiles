require('packer_init')

require('core/options')
require('core/keymaps')
require('core/autocmds')
require('core/tabline')

require('plugins/alpha-nvim')
-- require('plugins/nvim-cmp')
-- require('plugins/nvim-lspconfig')
-- require('plugins/nvim-treesitter')
require('plugins/nvim-tree')
require('plugins/feline')

-- require('plugins/lualine')

local alpha = require('alpha')

local fortune = require('alpha.fortune')

function HomePage()
    alpha.start()
end

function getFortune()
    tbl = fortune()
    str = ""
    for key, val in pairs(tbl) do
        val = val:gsub("%s+", " ")
        len = #val
        if len > 1 then
            str = str .. tostring(val) .. " "
        end
    end
    str = str:gsub("  ", " ")
    print(str)
end

local g = vim.g       -- Global variables
local opt = vim.opt   -- Set options (global/buffer/windows-scoped)

-- Custom Function: Enable Live Changes
function EnableLiveChanges()
    vim.cmd([[
        set autoread
        au CursorHold * checktime
    ]])
end

-- Vim Version
vim.cmd([[
    function EnableLiveChanges()
        set autoread
        au CursorHold * checktime
    endfunction
]])

-- Set Background To Dark
opt.background = 'dark'

-- Set Colorscheme to NeixOne
vim.cmd([[
    colorscheme NeixOne
]])

-- Colors
vim.cmd([[
    hi ActiveTab guibg=#98c379 guifg=#000000 ctermbg=114 ctermfg=235
    hi InactiveTab guibg=#000000 guifg=#ffffff ctermbg=236 ctermfg=145
    hi TabBuffer guibg=#282c34 guifg=#282c34 ctermbg=236 ctermfg=114
]])

-- Set Tab Line
vim.cmd([[
    set tabline=%!MyTabLine()
]])

-- Load Snippets
require("luasnip.loaders.from_vscode").lazy_load(
--     {
-- "C:/Users/txen2/AppData/Roaming/Code/User/snippets"
--     }
)


