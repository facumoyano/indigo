'use client'

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2 } from 'lucide-react';

interface FormData {
    nombre: string;
    apellido: string;
}

interface ContactFormDialogProps {
    children: ReactNode;
}

interface ApiResponse {
    success?: boolean;
    error?: string;
    data?: any;
}

export default function ContactFormDialog({ children }: ContactFormDialogProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [form1Data, setForm1Data] = useState<FormData>({
        nombre: '',
        apellido: ''
    });
    const [files1, setFiles1] = useState<File[]>([]);

    const [form2Data, setForm2Data] = useState<FormData>({
        nombre: '',
        apellido: ''
    });
    const [files2, setFiles2] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, formNumber: 1 | 2): void => {
        const fileList = e.target.files;
        if (!fileList) return;

        const newFiles = Array.from(fileList);
        if (formNumber === 1) {
            setFiles1(prev => [...prev, ...newFiles]);
        } else {
            setFiles2(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number, formNumber: 1 | 2): void => {
        if (formNumber === 1) {
            setFiles1(prev => prev.filter((_, i) => i !== index));
        } else {
            setFiles2(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (formNumber: 1 | 2): Promise<void> => {
        setLoading(true);

        try {
            const formData = new FormData();

            if (formNumber === 1) {
                formData.append('nombre', form1Data.nombre);
                formData.append('apellido', form1Data.apellido);
                formData.append('formType', 'formulario-1');
                files1.forEach(file => {
                    formData.append('files', file);
                });
            } else {
                formData.append('nombre', form2Data.nombre);
                formData.append('apellido', form2Data.apellido);
                formData.append('formType', 'formulario-2');
                files2.forEach(file => {
                    formData.append('files', file);
                });
            }

            const response = await fetch('/api/send-email', {
                method: 'POST',
                body: formData,
            });

            const result: ApiResponse = await response.json();

            if (response.ok) {
                alert('¡Email enviado exitosamente!');
                if (formNumber === 1) {
                    setForm1Data({ nombre: '', apellido: '' });
                    setFiles1([]);
                } else {
                    setForm2Data({ nombre: '', apellido: '' });
                    setFiles2([]);
                }
                setOpen(false);
            } else {
                alert(`Error: ${result.error || 'Error desconocido'}`);
            }
        } catch (error) {
            alert('Error al enviar el formulario');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[90%] max-h-[90vh] overflow-y-auto mx-auto z-9999" >
                <DialogHeader>
                    <DialogTitle className="text-2xl">Formulario de Contacto</DialogTitle>
                    <DialogDescription>
                        Completa el formulario que necesites y te contactaremos pronto.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="form1" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form1">Formulario 1</TabsTrigger>
                        <TabsTrigger value="form2">Formulario 2</TabsTrigger>
                    </TabsList>

                    <TabsContent value="form1">
                        <div className="space-y-4 mt-4">
                             <div className="space-y-2">
                                <Label htmlFor="nombre1">Email 1</Label>
                                <Input
                                    id="email1"
                                    value={form1Data.nombre}
                                    onChange={(e) => setForm1Data({ ...form1Data, nombre: e.target.value })}
                                    placeholder="Tu email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombre1">Nombre 1</Label>
                                <Input
                                    id="nombre1"
                                    value={form1Data.nombre}
                                    onChange={(e) => setForm1Data({ ...form1Data, nombre: e.target.value })}
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellido1">Apellido 1</Label>
                                <Input
                                    id="apellido1"
                                    value={form1Data.apellido}
                                    onChange={(e) => setForm1Data({ ...form1Data, apellido: e.target.value })}
                                    placeholder="Tu apellido"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Archivos adjuntos</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 1)}
                                        className="hidden"
                                        id="file-upload-1"
                                    />
                                    <label htmlFor="file-upload-1" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            Click para adjuntar archivos
                                        </span>
                                    </label>
                                </div>

                                {files1.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {files1.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span className="text-sm truncate flex-1">{file.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index, 1)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => handleSubmit(1)}
                                className="w-full"
                                disabled={loading || !form1Data.nombre || !form1Data.apellido}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Formulario 1'
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="form2">
                        <div className="space-y-4 mt-4">
                             <div className="space-y-2">
                                <Label htmlFor="nombre1">Email 2</Label>
                                <Input
                                    id="email2"
                                    value={form1Data.nombre}
                                    onChange={(e) => setForm1Data({ ...form1Data, nombre: e.target.value })}
                                    placeholder="Tu email"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nombre2">Nombre 2</Label>
                                <Input
                                    id="nombre2"
                                    value={form2Data.nombre}
                                    onChange={(e) => setForm2Data({ ...form2Data, nombre: e.target.value })}
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="apellido2">Apellido 2</Label>
                                <Input
                                    id="apellido2"
                                    value={form2Data.apellido}
                                    onChange={(e) => setForm2Data({ ...form2Data, apellido: e.target.value })}
                                    placeholder="Tu apellido"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Archivos adjuntos</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileChange(e, 2)}
                                        className="hidden"
                                        id="file-upload-2"
                                    />
                                    <label htmlFor="file-upload-2" className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-600">
                                            Click para adjuntar archivos
                                        </span>
                                    </label>
                                </div>

                                {files2.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {files2.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <span className="text-sm truncate flex-1">{file.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index, 2)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => handleSubmit(2)}
                                className="w-full"
                                disabled={loading || !form2Data.nombre || !form2Data.apellido}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar Formulario 2'
                                )}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}