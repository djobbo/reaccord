- MessageOptions
  @ [all message options as props]
- Embed[]
  - title
  - description
  @ url
  @ timestamp
  @ color
  - Footer
    > text
    @ icon_url
    @ proxy_icon_url
  - Image
    @ url
    @ proxy_url
    @ height
    @ width
  - Thumbnail
    @ url
    @ proxy_url
    @ height
    @ width
  - Video
    @ url
    @ proxy_url
    @ height
    @ width
  - Provider
    @ name
    @ url
  - Author
    @ name
    @ url
    @ icon_url
    @ proxy_icon_url
  - Field[]
    > value
    @ title -> name
    @ inline
- ActionRow[]
  - Button[]      (onClick!, !url)
  - LinkButton[]  (url!, !onClick)
  - SelectMenu
    - Options[<=25]
- File[]

  - Maybe?SelectMenuRow (same as SelectMenu, but should instantiate ActionRow on it's own)

  - Modal
    - ModalRow (same as ActionRow)
      - TextInput (should instantiate ActionRow on it's own)
    - Maybe?TextInputRow (same as TextInput, but should instantiate ModalRow on it's own)
