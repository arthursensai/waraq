'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroVisual() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.5, 5.5)
    camera.lookAt(0, 0, 0)

    // ── Resize handler ────────────────────────────────────────
    const handleResize = () => {
      const w = mount.offsetWidth
      const h = mount.offsetHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    const BW = 1.6, BH = 2.3, BD = 0.45

    function makeTexture(
      w: number,
      h: number,
      fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ) {
      const c = document.createElement('canvas')
      c.width = w
      c.height = h
      fn(c.getContext('2d')!, w, h)
      return new THREE.CanvasTexture(c)
    }

    // ── Front cover ───────────────────────────────────────────
    const frontTex = makeTexture(512, 740, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#1e1a14')
      g.addColorStop(1, '#0f0d09')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(232,184,109,0.45)'
      ctx.lineWidth = 3
      ctx.strokeRect(18, 18, w - 36, h - 36)
      ctx.strokeStyle = 'rgba(232,184,109,0.15)'
      ctx.lineWidth = 1
      ctx.strokeRect(28, 28, w - 56, h - 56)

      ctx.fillStyle = 'rgba(232,184,109,0.5)'
      ctx.fillRect(w / 2 - 50, 52, 100, 1.5)
      ctx.fillStyle = 'rgba(232,184,109,0.25)'
      ctx.fillRect(w / 2 - 30, 46, 60, 1)

      ctx.fillStyle = '#E8B86D'
      ctx.font = 'bold 96px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(232,184,109,0.5)'
      ctx.shadowBlur = 22
      ctx.fillText('WARAQ', w / 2, h * 0.36)
      ctx.shadowBlur = 0

      ctx.fillStyle = 'rgba(220,195,155,0.55)'
      ctx.font = '500 17px serif'
      ctx.fillText('YOUR READING LIBRARY', w / 2, h * 0.36 + 68)

      ctx.fillStyle = 'rgba(232,184,109,0.3)'
      ctx.fillRect(w / 2 - 70, h * 0.62, 140, 1)

      ctx.fillStyle = 'rgba(210,190,155,0.65)'
      ctx.font = '19px serif'
      ctx.fillText('by Arthur', w / 2, h * 0.82)

      ctx.fillStyle = 'rgba(232,184,109,0.4)'
      ctx.fillRect(w / 2 - 50, h - 50, 100, 1.5)
    })

    // ── Back cover ────────────────────────────────────────────
    const backTex = makeTexture(512, 740, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#1a1710')
      g.addColorStop(1, '#0f0d09')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(232,184,109,0.25)'
      ctx.lineWidth = 2
      ctx.strokeRect(18, 18, w - 36, h - 36)
      ctx.fillStyle = 'rgba(232,184,109,0.12)'
      ctx.font = 'bold 52px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('WARAQ', w / 2, h / 2)
    })

    // ── Spine ─────────────────────────────────────────────────
    const spineTex = makeTexture(128, 740, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, 0)
      g.addColorStop(0, '#2a2318')
      g.addColorStop(0.5, '#1a1510')
      g.addColorStop(1, '#0f0d09')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = 'rgba(232,184,109,0.3)'
      ctx.lineWidth = 1
      ctx.strokeRect(6, 6, w - 12, h - 12)
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = '#E8B86D'
      ctx.font = 'bold 22px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('WARAQ', 0, 0)
      ctx.restore()
    })

    // ── Page edges ────────────────────────────────────────────
    const pagesTex = makeTexture(256, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#ddd5c0'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 180; i++) {
        const y = (i / 180) * h
        const s = Math.random()
        ctx.fillStyle =
          s > 0.85
            ? 'rgba(160,140,110,0.25)'
            : s > 0.6
            ? 'rgba(255,250,240,0.4)'
            : 'rgba(200,185,160,0.15)'
        ctx.fillRect(0, y, w, (h / 180) * 0.7)
      }
      const eg = ctx.createLinearGradient(0, 0, w, 0)
      eg.addColorStop(0, 'rgba(80,60,30,0.22)')
      eg.addColorStop(0.15, 'rgba(80,60,30,0.05)')
      eg.addColorStop(0.85, 'rgba(80,60,30,0.04)')
      eg.addColorStop(1, 'rgba(80,60,30,0.18)')
      ctx.fillStyle = eg
      ctx.fillRect(0, 0, w, h)
      const tg = ctx.createLinearGradient(0, 0, 0, h)
      tg.addColorStop(0, 'rgba(60,40,20,0.35)')
      tg.addColorStop(0.04, 'rgba(60,40,20,0.08)')
      tg.addColorStop(0.96, 'rgba(60,40,20,0.08)')
      tg.addColorStop(1, 'rgba(60,40,20,0.35)')
      ctx.fillStyle = tg
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = `rgba(200,170,100,${Math.random() * 0.12})`
        ctx.fillRect(0, Math.random() * h, w, Math.random() * 6 + 2)
      }
    })

    // ── Top / bottom pages ────────────────────────────────────
    const topTex = makeTexture(512, 256, (ctx, w, h) => {
      ctx.fillStyle = '#d8cdb8'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 200; i++) {
        const x = (i / 200) * w
        const s = Math.random()
        ctx.fillStyle =
          s > 0.8
            ? 'rgba(140,120,90,0.2)'
            : s > 0.55
            ? 'rgba(255,248,235,0.35)'
            : 'rgba(180,165,140,0.1)'
        ctx.fillRect(x, 0, (w / 200) * 0.6, h)
      }
      const sg = ctx.createLinearGradient(0, 0, w, 0)
      sg.addColorStop(0, 'rgba(40,28,14,0.45)')
      sg.addColorStop(0.08, 'rgba(40,28,14,0.08)')
      sg.addColorStop(0.92, 'rgba(40,28,14,0.04)')
      sg.addColorStop(1, 'rgba(40,28,14,0.2)')
      ctx.fillStyle = sg
      ctx.fillRect(0, 0, w, h)
      const eg = ctx.createLinearGradient(0, 0, 0, h)
      eg.addColorStop(0, 'rgba(50,35,15,0.3)')
      eg.addColorStop(0.12, 'rgba(50,35,15,0.05)')
      eg.addColorStop(0.88, 'rgba(50,35,15,0.05)')
      eg.addColorStop(1, 'rgba(50,35,15,0.3)')
      ctx.fillStyle = eg
      ctx.fillRect(0, 0, w, h)
    })

    // ── Book mesh ─────────────────────────────────────────────
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    const materials = [
      new THREE.MeshStandardMaterial({ map: frontTex,  roughness: 0.55, metalness: 0.05 }),
      new THREE.MeshStandardMaterial({ map: backTex,   roughness: 0.6,  metalness: 0.0  }),
      new THREE.MeshStandardMaterial({ map: topTex,    roughness: 0.92, metalness: 0    }),
      new THREE.MeshStandardMaterial({ map: topTex,    roughness: 0.92, metalness: 0    }),
      new THREE.MeshStandardMaterial({ map: pagesTex,  roughness: 0.97, metalness: 0    }),
      new THREE.MeshStandardMaterial({ map: spineTex,  roughness: 0.5,  metalness: 0.08 }),
    ]

    const book = new THREE.Mesh(new THREE.BoxGeometry(BD, BH, BW), materials)
    book.castShadow = true
    scene.add(book)

    // Shadow plane
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    )
    shadowPlane.rotation.x = -Math.PI / 2
    shadowPlane.position.y = -BH / 2 - 0.01
    shadowPlane.receiveShadow = true
    scene.add(shadowPlane)

    // ── Lighting ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.4))

    const keyLight = new THREE.DirectionalLight(0xffecd0, 1.8)
    keyLight.position.set(3, 4, 3)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xc8d8ff, 0.35)
    fillLight.position.set(-3, 1, 2)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xe8b86d, 0.6)
    rimLight.position.set(0, 2, -4)
    scene.add(rimLight)

    const pointLight = new THREE.PointLight(0xffd090, 0.5, 8)
    pointLight.position.set(0, -1, 3)
    scene.add(pointLight)

    // ── Pointer interaction ───────────────────────────────────
    let isDragging = false
    let prevX = 0, prevY = 0
    let rotX = 0.08, rotY = 0
    let velX = 0, velY = 0.003

    const el = renderer.domElement

    const onMouseDown  = (e: MouseEvent)  => { isDragging = true; prevX = e.clientX; prevY = e.clientY; velX = velY = 0 }
    const onMouseUp    = ()               => { isDragging = false }
    const onMouseMove  = (e: MouseEvent)  => {
      if (!isDragging) return
      velY = (e.clientX - prevX) * 0.008
      velX = (e.clientY - prevY) * 0.008
      rotY += velY
      rotX = Math.max(-0.5, Math.min(0.5, rotX + velX))
      prevX = e.clientX; prevY = e.clientY
    }
    const onTouchStart = (e: TouchEvent) => { isDragging = true; prevX = e.touches[0].clientX; prevY = e.touches[0].clientY; velX = velY = 0 }
    const onTouchEnd   = ()              => { isDragging = false }
    const onTouchMove  = (e: TouchEvent) => {
      if (!isDragging) return
      velY = (e.touches[0].clientX - prevX) * 0.008
      velX = (e.touches[0].clientY - prevY) * 0.008
      rotY += velY
      rotX = Math.max(-0.5, Math.min(0.5, rotX + velX))
      prevX = e.touches[0].clientX; prevY = e.touches[0].clientY
    }

    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    // ── Animation loop ────────────────────────────────────────
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isDragging) {
        velY *= 0.95; velX *= 0.95
        rotY += velY + 0.003
        rotX = (rotX + velX) * 0.97
      }
      book.rotation.y = rotY
      book.rotation.x = rotX
      book.position.y = Math.sin(Date.now() * 0.001) * 0.06
      renderer.render(scene, camera)
    }
    animate()

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchmove', onTouchMove)
      renderer.dispose()
      materials.forEach(m => { m.map?.dispose(); m.dispose() })
      if (mount.contains(el)) mount.removeChild(el)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ minHeight: '520px' }}
    />
  )
}