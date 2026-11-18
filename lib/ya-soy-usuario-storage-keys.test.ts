import { describe, expect, it } from "vitest"

import {
  buildYaSoyUsuarioUploadKey,
  isYaSoyUsuarioFileSection,
  isYaSoyUsuarioKeyForSection,
} from "./ya-soy-usuario-storage-keys"

describe("buildYaSoyUsuarioUploadKey", () => {
  it("ubica el archivo bajo su seccion con un nombre seguro para URL", () => {
    const key = buildYaSoyUsuarioUploadKey("cbct", "Tomografía Pérez (final).zip")

    expect(key).toMatch(/^ya-soy-usuario\/cbct\/\d+-[0-9a-f-]{36}-Tomografia-Perez-final-.zip$/)
  })

  it("no deja escapar del prefijo con nombres maliciosos", () => {
    const key = buildYaSoyUsuarioUploadKey("cbct", "../../otro/../secreto")

    expect(key.startsWith("ya-soy-usuario/cbct/")).toBe(true)
    expect(key).not.toContain("..")
    expect(key.split("/")).toHaveLength(3)
  })

  it("usa un nombre por defecto cuando no queda nada utilizable", () => {
    expect(buildYaSoyUsuarioUploadKey("cbct", "///")).toMatch(/-archivo$/)
  })
})

describe("isYaSoyUsuarioKeyForSection", () => {
  it("acepta claves de la propia seccion", () => {
    expect(isYaSoyUsuarioKeyForSection(buildYaSoyUsuarioUploadKey("cbct", "a.zip"), "cbct")).toBe(true)
  })

  it("rechaza claves de otra seccion, de otro prefijo o con traversal", () => {
    expect(isYaSoyUsuarioKeyForSection("ya-soy-usuario/facialPhotos/a.jpg", "cbct")).toBe(false)
    expect(isYaSoyUsuarioKeyForSection("ya-soy-usuario/manifests/x.json", "cbct")).toBe(false)
    expect(isYaSoyUsuarioKeyForSection("otra-cosa/cbct/a.zip", "cbct")).toBe(false)
    expect(isYaSoyUsuarioKeyForSection("ya-soy-usuario/cbct/../manifests/x.json", "cbct")).toBe(false)
    expect(isYaSoyUsuarioKeyForSection(42, "cbct")).toBe(false)
  })
})

describe("isYaSoyUsuarioFileSection", () => {
  it("solo reconoce secciones del formulario", () => {
    expect(isYaSoyUsuarioFileSection("cbct")).toBe(true)
    expect(isYaSoyUsuarioFileSection("manifests")).toBe(false)
    expect(isYaSoyUsuarioFileSection("toString")).toBe(false)
  })
})
