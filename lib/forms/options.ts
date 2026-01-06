export type FormOption = { value: string; label: string }

export const discoveryOptions: FormOption[] = [
  { value: "social", label: "Redes sociales" },
  { value: "referrals", label: "Recomendación de otros colegas" },
  { value: "courses", label: "Por haber realizado cursos con Migrando al 3D" },
  { value: "other", label: "Otro" },
]

export const alignerOptions: FormOption[] = [
  { value: "none", label: "No" },
  { value: "in-office", label: "Sí in office" },
  { value: "companies", label: "Sí con empresas" },
]

export const yesNoOptions: FormOption[] = [
  { value: "yes", label: "Sí" },
  { value: "no", label: "No" },
]

export const jawsOptions: FormOption[] = [
  { value: "upper", label: "Maxilar superior" },
  { value: "lower", label: "Maxilar inferior" },
  { value: "both", label: "Ambos" },
]

export const midlineOptions: FormOption[] = [
  { value: "keep-both", label: "Mantener ambas" },
  { value: "keep-upper", label: "Mantener superior" },
  { value: "keep-lower", label: "Mantener inferior" },
  { value: "move-upper-right", label: "Mover superior a la derecha" },
  { value: "move-upper-left", label: "Mover superior a la izquierda" },
  { value: "move-lower-right", label: "Mover inferior a la derecha" },
  { value: "move-lower-left", label: "Mover inferior a la izquierda" },
]

export const overjetOptions: FormOption[] = [
  { value: "keep", label: "No modificarlo" },
  { value: "increase", label: "Aumentarlo" },
  { value: "decrease", label: "Disminuirlo" },
]

export const crossbiteOptions: FormOption[] = [
  { value: "fix", label: "Intentar corregirla" },
  { value: "no-change", label: "No modificarla" },
  { value: "no-crossbite", label: "No existe mordida cruzada posterior" },
]

export const boltonOptions: FormOption[] = [
  { value: "distal-laterals", label: "Dejar espacios por distal de incisivos laterales" },
  { value: "distal-canines", label: "Dejar espacios por distal de caninos superiores" },
  { value: "distribute", label: "Distribuir espacios equitativamente por mesial y distal de incisivos laterales" },
  { value: "lower-stripping", label: "Corregir Bolton con stripping inferior en caso posible" },
]

export const upperCrowdingOptions: FormOption[] = [
  { value: "stripping", label: "Stripping" },
  { value: "proinclination", label: "Proinclinación" },
  { value: "expansion", label: "Expansión" },
  { value: "distalization", label: "Distalamiento" },
  { value: "other", label: "Otro" },
]

export const lowerCrowdingOptions: FormOption[] = [
  { value: "stripping", label: "Stripping" },
  { value: "proinclination", label: "Proinclinación" },
  { value: "expansion", label: "Expansión" },
  { value: "distalization", label: "Distalamiento" },
]

export const indigoProfessionalOptions: FormOption[] = [
  { value: "paulina-albar", label: "Od. Paulina Albar Día" },
  { value: "viviana-polimant", label: "Od. Viviana Polimant" },
  { value: "ayelen-oliver", label: "Od. Ayelén Oliver" },
  { value: "catalina-fey", label: "Od. Catalina Fey" },
]
