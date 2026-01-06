'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form'
import Image from "next/image"
import { Images } from "@/app/images"
import { Upload, X } from "lucide-react"
import {
    boltonOptions,
    crossbiteOptions,
    indigoProfessionalOptions,
    jawsOptions,
    lowerCrowdingOptions,
    midlineOptions,
    overjetOptions,
    upperCrowdingOptions,
    yesNoOptions,
} from '@/lib/forms/options'
import { yaSoyUsuarioFormSchema, type YaSoyUsuarioFormValues } from '@/lib/forms/ya-soy-usuario-schema'

const textareaClasses = "min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm md:text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

const megabyte = 1024 * 1024
const gigabyte = megabyte * 1024

const fileFieldConstraints = {
    facialPhotos: { maxCount: 5, maxSizeBytes: 100 * megabyte, maxSizeLabel: '100 MB' },
    intraoralPhotos: { maxCount: 10, maxSizeBytes: 100 * megabyte, maxSizeLabel: '100 MB' },
    lateralTeleradiography: { maxCount: 1, maxSizeBytes: gigabyte, maxSizeLabel: '1 GB' },
    orthopantomography: { maxCount: 1, maxSizeBytes: 10 * gigabyte, maxSizeLabel: '10 GB' },
    cbct: { maxCount: 1, maxSizeBytes: gigabyte, maxSizeLabel: '1 GB' },
    intraoralScan: { maxCount: 5, maxSizeBytes: gigabyte, maxSizeLabel: '1 GB' },
} as const

type FileFieldName = keyof typeof fileFieldConstraints

const FileUploadButton = ({ text = "Añadir archivo" }: { text?: string }) => {
    const { formItemId } = useFormField()

    return (
        <label
            htmlFor={formItemId}
            className="border-2 border-gray-200 rounded-lg px-4 py-2 text-center hover:border-gray-400 transition-colors w-fit cursor-pointer flex items-center gap-3"
        >
            <Upload className="w-4 h-4 text-gray-text" />
            <span className="text-sm text-gray-text">{text}</span>
        </label>
    )
}

const SelectedFilesList = ({ files, onRemove }: { files?: File[]; onRemove: (index: number) => void }) => {
    if (!files || files.length === 0) return null

    return (
        <ul className="mt-2 space-y-2">
            {files.map((file, index) => (
                <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-text bg-gray-100"
                >
                    <span className="truncate pr-3">{file.name}</span>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-gray-400 transition-colors hover:text-gray-500 cursor-pointer"
                        aria-label={`Eliminar ${file.name}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </li>
            ))}
        </ul>
    )
}

const isFileArray = (value: unknown): value is File[] =>
    Array.isArray(value) && value.length > 0 && value.every((item) => item instanceof File)


const FormYaSoyUsuario = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const form = useForm({
        resolver: zodResolver(yaSoyUsuarioFormSchema),
        defaultValues: {
            professionalFullName: "",
            professionalPhone: "",
            professionalEmail: "",
            professionalResidence: "",
            patientFullName: "",
            patientBirthDay: "",
            patientBirthMonth: "",
            patientBirthYear: "",
            facialPhotos: [],
            intraoralPhotos: [],
            lateralTeleradiography: [],
            orthopantomography: [],
            cbct: [],
            intraoralScan: [],
            mainReason: "",
            elementsToKeep: "",
            upperCrowdingOther: "",
            additionalInfo: "",
        },
    })

    const upperCrowdingSelection = form.watch('upperCrowdingResolution')

    const handleFileSelection = (
        fieldName: FileFieldName,
        files: FileList | null,
        fieldValue: File[] | undefined,
        onChange: (files: File[]) => void,
    ) => {
        if (!files || files.length === 0) return

        const constraints = fileFieldConstraints[fieldName]
        const currentFiles = fieldValue ?? []
        const availableSlots = Math.max(constraints.maxCount - currentFiles.length, 0)

        let sizeRejected = 0
        const validBySize = Array.from(files).filter((file) => {
            if (file.size <= constraints.maxSizeBytes) return true
            sizeRejected++
            return false
        })

        const filesToAdd = validBySize.slice(0, availableSlots)
        const countRejected = validBySize.length - filesToAdd.length

        if (filesToAdd.length > 0) {
            onChange([...currentFiles, ...filesToAdd])
        }

        if (sizeRejected > 0 || countRejected > 0) {
            const messages: string[] = []
            if (sizeRejected > 0) {
                messages.push(`Cada archivo debe pesar hasta ${constraints.maxSizeLabel}.`)
            }
            if (countRejected > 0 || availableSlots === 0) {
                messages.push(`Podés subir hasta ${constraints.maxCount} archivo${constraints.maxCount === 1 ? '' : 's'} en esta sección.`)
            }
            form.setError(fieldName, {
                type: 'manual',
                message: messages.join(' '),
            })
        } else {
            form.clearErrors(fieldName)
        }
    }

    const onSubmit = async (values: YaSoyUsuarioFormValues) => {
        setIsSubmitting(true)
        setFeedback(null)

        try {
            const body = new FormData()
            Object.entries(values).forEach(([key, value]) => {
                if (isFileArray(value)) {
                    value.forEach((file) => body.append(key, file))
                } else if (value !== undefined && value !== null) {
                    body.append(key, String(value))
                }
            })

            const response = await fetch('/api/ya-soy-usuario', {
                method: 'POST',
                body,
            })

            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(payload?.error ?? 'Ocurrió un error al enviar el formulario.')
            }

            setFeedback({ type: 'success', message: '¡Gracias! Recibimos la información del caso.' })
            form.reset()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'No pudimos enviar el formulario.'
            setFeedback({ type: 'error', message })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 rounded-4xl border border-gray-300 p-5 md:p-8 mb-10">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-custom">Datos del profesional</h2>
                    <FormField
                        control={form.control}
                        name="professionalFullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Nombre y apellido del profesional</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="professionalPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Teléfono de contacto del profesional</FormLabel>
                                <FormControl>
                                    <Input type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="professionalEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Correo del profesional</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="professionalResidence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Lugar de residencia</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <div className='h-[1px] bg-gray-200 w-full'></div>


                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-custom">Datos del paciente</h2>
                    <FormField
                        control={form.control}
                        name="patientFullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Nombre y apellido del paciente</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <p className="font-bold text-sm md:text-base">Fecha de nacimiento del paciente</p>
                        <div className="flex gap-4">
                            <FormField
                                control={form.control}
                                name="patientBirthDay"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="font-bold">Día (DD)</FormLabel> */}
                                        <FormControl>
                                            <Input {...field} inputMode="numeric" maxLength={2} placeholder="DD" className="w-14" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="patientBirthMonth"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="font-bold">Mes (MM)</FormLabel> */}
                                        <FormControl>
                                            <Input {...field} inputMode="numeric" maxLength={2} placeholder="MM" className="w-14" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="patientBirthYear"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="font-bold">Año (AAAA)</FormLabel> */}
                                        <FormControl>
                                            <Input {...field} inputMode="numeric" maxLength={4} placeholder="AAAA" className="w-16" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </section>
                <div className='h-[1px] bg-gray-200 w-full'></div>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-custom">Archivos digitales del paciente</h2>
                    <p className="text-sm md:text-base text-gray-custom">En esta sección deberás seleccionar las fotos y radiografías. También podrás subir el archivo STL -escaneos- y DICOM-tomografía Cone Beam-, en los casos que sean necesarios.</p>
                    <div className="h-[1px] bg-gray-text w-full"></div>
                <FormField
                        control={form.control}
                        name="facialPhotos"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold leading-normal !block">
                                    <span className="whitespace-nowrap">Fotos faciales:</span>{' '}
                                    <span className="font-normal">Frente, frente con sonrisa, perfil perfil con sonrisa, 3/4 con sonrisa.</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('facialPhotos', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 5 <br />Peso máximo archivo: 100 MB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('facialPhotos')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-[1px] bg-gray-text w-full"></div>

                    <FormField
                        control={form.control}
                        name="intraoralPhotos"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold leading-normal !block">
                                    <span className="whitespace-nowrap">Fotos intraorales:</span>{' '}
                                    <span className="font-normal">Frente en oclusion, frente en desoclusión, lateral derecha, lateral izquierda, oclusal superior, oclusal inferior.</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('intraoralPhotos', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 10 <br />Peso máximo archivo: 100 MB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('intraoralPhotos')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-[1px] bg-gray-text w-full"></div>

                    <FormField
                        control={form.control}
                        name="lateralTeleradiography"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Teleradiografía lateral</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('lateralTeleradiography', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 1 <br />Peso máximo archivo: 1 GB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('lateralTeleradiography')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-[1px] bg-gray-text w-full"></div>

                    <FormField
                        control={form.control}
                        name="orthopantomography"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Ortopantomografía</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('orthopantomography', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 1 <br />Peso máximo archivo: 10 GB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('orthopantomography')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-[1px] bg-gray-text w-full"></div>

                    <FormField
                        control={form.control}
                        name="cbct"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">CBCT</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('cbct', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 1 <br />Peso máximo archivo: 1 GB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('cbct')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-[1px] bg-gray-text w-full"></div>

                    <FormField
                        control={form.control}
                        name="intraoralScan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Escaneo intraoral</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(event) => {
                                            handleFileSelection('intraoralScan', event.target.files, field.value, field.onChange)
                                            event.target.value = ''
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="hidden"
                                    />
                                </FormControl>
                                <div className="flex gap-2">
                                    <FileUploadButton />
                                    <div className="text-xs text-gray-text">Número máximo archivos: 5 <br />Peso máximo archivo: 1GB</div>
                                </div>
                                <SelectedFilesList
                                    files={field.value}
                                    onRemove={(index) => {
                                        const remainingFiles = (field.value ?? []).filter((_, fileIndex) => fileIndex !== index)
                                        field.onChange(remainingFiles)
                                        form.clearErrors('intraoralScan')
                                    }}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>
                <div className='h-[1px] bg-gray-200 w-full'></div>


                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-blue-custom">Información de diagnóstico y plan de tratamiento:</h2>
                    <FormField
                        control={form.control}
                        name="mainReason"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Motivo principal de la consulta</FormLabel>
                                <FormControl>
                                    <textarea className={textareaClasses} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="previousTreatments"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">¿Ha realizado tratamientos ortodóncicos previos?</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {yesNoOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="jawsToTreat"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">Seleccione maxilares a tratar</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {jawsOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="elementsToKeep"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Elementos que no desea modificar de posición (colocar número)</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="midlinePreference"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">Con respecto a la línea media</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {midlineOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="overjetPreference"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">En cuanto al resalte</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {overjetOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="posteriorCrossbite"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">Si existiera mordida cruzada posterior</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {crossbiteOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="boltonDiscrepancy"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">En caso de discrepancia de Bolton</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {boltonOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="upperCrowdingResolution"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">En caso de apilamiento dentario en maxilar superior, resolverlo preferentemente mediante</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {upperCrowdingOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {upperCrowdingSelection === 'other' && (
                        <FormField
                            control={form.control}
                            name="upperCrowdingOther"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Detalle la alternativa elegida</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                    <FormField
                        control={form.control}
                        name="lowerCrowdingResolution"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">En caso de apilamiento dentario en maxilar inferior, resolverlo preferentemente mediante</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {lowerCrowdingOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="additionalInfo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">A continuación, te solicitamos que completes con toda aquella
información que pienses sea relevante al momento de
planificar el tratamiento del paciente.</FormLabel>
                                <FormControl>
                                    <textarea className={textareaClasses} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="indigoProfessional"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-bold">Profesional de Indigo a quién va dirigido el caso clínico</FormLabel>
                                <FormControl>
                                    <div className='space-y-2'>
                                        {indigoProfessionalOptions.map((option) => (
                                            <label key={option.value} className='flex items-center space-x-3 text-gray-text'>
                                                <input
                                                    type="radio"
                                                    value={option.value}
                                                    checked={field.value === option.value}
                                                    onChange={() => field.onChange(option.value)}
                                                    onBlur={field.onBlur}
                                                    className='h-4 w-4 rounded-full border-2 border-blue-custom text-blue-custom focus:ring-blue-custom accent-blue-custom'
                                                />
                                                <span className="text-sm md:text-base">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <div className="flex flex-col items-center space-y-4">
                    <button
                        type="submit"
                        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        <Image
                            src={Images.desktop.common.btnEnviar}
                            alt="Enviar"
                            width={150}
                            height={40}
                        />
                    </button>
                    {feedback && (
                        <p
                            className={`text-center text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
                            role="status"
                        >
                            {feedback.message}
                        </p>
                    )}
                </div>
            </form>
        </Form>
    )
}

export default FormYaSoyUsuario
