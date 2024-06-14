import { Button, Card } from '@/components/ui'
import React from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import ClientForm from './ClientForm'
import { useNavigate } from 'react-router-dom'

const NewClient = () => {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h3>Crear cliente</h3>
                </div>

                <div className="flex flex-row gap-4">
                    <div>
                        <Button
                            size="sm"
                            variant="solid"
                            color="red-500"
                            icon={<HiArrowLeft />}
                            onClick={() => {
                                navigate(-1)
                            }}
                        >
                            Regresar
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mt-6">
                <Card>
                    <ClientForm />
                </Card>
            </div>
        </>
    )
}

export default NewClient
