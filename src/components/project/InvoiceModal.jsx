import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { generateInvoice } from '../../utils/invoiceGenerator'

const InvoiceModal = ({ isOpen, onClose, project, payments }) => {
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    paymentInstructions: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerateInvoice = () => {
    const doc = generateInvoice(project, payments, companyInfo)
    doc.save(`invoice-${project.name.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Generate Invoice"
      maxWidth="lg"
    >
      <div className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="label">Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={companyInfo.name}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="address" className="label">Company Address</label>
          <textarea
            id="address"
            name="address"
            value={companyInfo.address}
            onChange={handleInputChange}
            className="input min-h-[80px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={companyInfo.email}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="label">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={companyInfo.phone}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="paymentInstructions" className="label">Payment Instructions</label>
          <textarea
            id="paymentInstructions"
            name="paymentInstructions"
            value={companyInfo.paymentInstructions}
            onChange={handleInputChange}
            className="input min-h-[80px]"
            placeholder="e.g., Bank transfer details or payment methods accepted"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invoice Preview</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>• Company details and logo</p>
            <p>• Project information</p>
            <p>• Payment history table</p>
            <p>• Payment instructions</p>
            <p>• Professional PDF format</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 space-x-3">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="primary"
          onClick={handleGenerateInvoice}
          disabled={!companyInfo.name || !companyInfo.address || !companyInfo.email || !companyInfo.phone}
        >
          Generate Invoice
        </Button>
      </div>
    </Modal>
  )
}

export default InvoiceModal