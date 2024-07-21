"use client"

import React, { ReactNode } from 'react'
import { QueryProviders } from './query-provider'

interface ProvidersProps {
    children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => <QueryProviders>
    {children}
</QueryProviders>

export default Providers