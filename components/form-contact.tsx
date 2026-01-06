'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Image from "next/image"
import { Images } from "@/app/images"
import { alignerOptions, discoveryOptions } from '@/lib/forms/options'
import { contactFormSchema, type ContactFormValues } from '@/lib/forms/contact-form-schema'

const FormContact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            residence: "",
            discoverySource: undefined,
            alignerStatus: undefined,
            inOfficeSoftware: "",
            companyPartners: "",
        },
    })

    async function onSubmit(values: ContactFormValues) {
        setIsSubmitting(true)
        setFeedback(null)

        try {
            const response = await fetch('/api/contactar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(payload?.error ?? 'Ocurrió un error al enviar el formulario.')
            }

            setFeedback({ type: 'success', message: '¡Gracias! Recibimos tu información correctamente.' })
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 rounded-4xl border border-gray-300 p-6 md:p-8 mb-10">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Nombre y apellido del profesional</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Teléfono del contacto del profesional</FormLabel>
                            <FormControl>
                                <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Correo del profesional</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="residence"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Lugar de residencia</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discoverySource"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="font-bold text-base md:text-lg">¿Cómo nos conociste?</FormLabel>
                            <FormControl>
                                <div className='space-y-2'>
                                    {discoveryOptions.map((option) => (
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
                    name="alignerStatus"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="font-bold text-base md:text-lg">¿Ya realizás tratamientos con alineadores?</FormLabel>
                            <FormControl>
                                <div className='space-y-2'>
                                    {alignerOptions.map((option) => (
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
                    name="inOfficeSoftware"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Si realizás alineadores In Office, ¿qué software utilizás?</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="companyPartners"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-bold text-base md:text-lg">Si realizás alineadores con otras empresas, ¿con cuáles trabajás?</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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

export default FormContact
