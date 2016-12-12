let cursor
let prevCursorState

export function loadMouseCursor () {
  this.game.load.atlasJSONHash('mouse_cursors', 'assets/mouse_cursors.png', 'assets/mouse_cursors.json')
}

export function createMouseCursor () {
  // Track mouse cursor
  cursor = this.game.add.sprite(0, 0, 'mouse_cursors', 'neutral')
  prevCursorState = 'neutral'
  cursor.scale.setTo(0.5, 0.5)
  this.game.input.addMoveCallback(function (pointer, x, y) {
    cursor.x = x
    cursor.y = y
  })

  this.game.input.mousePointer.leftButton.onDown.add(() => {
    setMouseCursorState('click')
  }, this)

  this.game.input.mousePointer.leftButton.onUp.add(() => {
    revertMouseCursorState()
  }, this)

  // Ensure cursor stays on top of text
  const cursorGroup = this.game.add.group()
  cursorGroup.add(cursor)
  this.game.world.bringToTop(cursorGroup)
}

// click, highlight or neutral
export function setMouseCursorState (state) {
  prevCursorState = cursor.frameName
  cursor.frameName = state
}

export function revertMouseCursorState () {
  cursor.frameName = prevCursorState
}

export function hideMouseCursor () {
  cursor.visible = false
}

export function showMouseCursor () {
  cursor.visible = true
}

export function setHeldItem (item) {
  cursor.loadTexture(item.key, 0)
}

export function releaseItem () {
  cursor.loadTexture('mouse_cursors', 'neutral')
}
