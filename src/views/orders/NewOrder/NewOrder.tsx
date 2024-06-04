import { Button, Input } from '@/components/ui'
import React from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import OrderForm from './NewOrderForm'

const NewOrder = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="flex justify-between">
                <div>
                    <h3>Crear pedido</h3>
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
                    <OrderForm />
                </Card>
            </div>
        </>
    )
}

export default NewOrder
