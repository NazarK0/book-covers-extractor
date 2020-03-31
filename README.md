**About:** This package extracts first page of various documents from pointed folder and convert to jpeg picture

**Supported OS:** GNU/Linux only( Server and desktop ).

**Before usage:** on machine must be installed libreoffice, calibre and djvulibre-bin. If you don`t have
those, please install using package manager. For example on Debian-like machine run

```bash
apt-get update
sudo apt-get install calibre djvulibre-bin libreoffice [--no-install-recommends]
```

key *--no-install-recommends* optional, use it if you use package on server, this prevent installation of GUI for libreoffice

## Supported formats:

### e-book formats:
- djvu
- pdf
- azw4
- chm
- epub
- fb2
- htlz
- html
- lit
- lrf
- mobi
- odt
- pdb
- pml
- rb
- snb
- tcr
- txt

### Office formats:
- ppt, pptx
- doc, docx
- csv
- xls, xlsx
- dotx
- vsd, vsdx
- rtf

**Usage:**

You must specify in which folder exist documents that need to convert. In folder could exist another folders, package process all of them recursively. Source folder path could be or relative or absolute.

```javascript
const BookCoversExtractor = require('book-covers-extractor');
//by default images will be stored in your home directory in folder 'paperbacks'
BookCoversExtractor("./books");

//also you can manually point in which folder images will be stored. You can use as absolute as relative paths. If folder don`t exist, it will be created.
BookCoversExtractor("./books", "/home/users/FooUser");
```