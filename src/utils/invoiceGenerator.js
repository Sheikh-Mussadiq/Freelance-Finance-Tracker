import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'

export const generateInvoice = (project, payments, companyInfo) => {
  const doc = new jsPDF()
  
  // Set font
  doc.setFont('helvetica')
  
  // Add company logo and info
  doc.setFontSize(20)
  doc.text(companyInfo.name, 20, 20)
  
  doc.setFontSize(10)
  doc.text(companyInfo.address, 20, 30)
  doc.text(companyInfo.email, 20, 35)
  doc.text(companyInfo.phone, 20, 40)
  
  // Add invoice details
  doc.setFontSize(16)
  doc.text('INVOICE', 150, 20)
  
  doc.setFontSize(10)
  doc.text(`Invoice Date: ${format(new Date(), 'MMM d, yyyy')}`, 150, 30)
  doc.text(`Invoice #: INV-${project.id.slice(0, 8)}`, 150, 35)
  
  // Add client info
  doc.setFontSize(12)
  doc.text('Bill To:', 20, 60)
  doc.setFontSize(10)
  doc.text(project.client, 20, 70)
  
  // Add project details
  doc.setFontSize(12)
  doc.text('Project Details:', 20, 90)
  doc.setFontSize(10)
  doc.text(`Project Name: ${project.name}`, 20, 100)
  doc.text(`Contract Type: ${project.contractType.charAt(0).toUpperCase() + project.contractType.slice(1)}`, 20, 105)
  doc.text(`Payment Terms: ${project.paymentTerms}`, 20, 110)
  doc.text(`Start Date: ${format(new Date(project.startDate), 'MMM d, yyyy')}`, 20, 115)
  if (project.endDate) {
    doc.text(`End Date: ${format(new Date(project.endDate), 'MMM d, yyyy')}`, 20, 120)
  }
  
  // Add payment details table
  doc.autoTable({
    startY: 130,
    head: [['Date', 'Description', 'Amount']],
    body: payments.map(payment => [
      format(new Date(payment.date), 'MMM d, yyyy'),
      payment.description,
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'PKR' 
      }).format(payment.amount)
    ]),
    foot: [[
      'Total',
      '',
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'PKR' 
      }).format(payments.reduce((sum, payment) => sum + payment.amount, 0))
    ]],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    footStyles: { fillColor: [41, 128, 185] }
  })
  
  // Add payment instructions
  const finalY = doc.lastAutoTable.finalY || 150
  doc.setFontSize(10)
  doc.text('Payment Instructions:', 20, finalY + 20)
  doc.text(companyInfo.paymentInstructions || 'Please make payment within 30 days.', 20, finalY + 30)
  
  // Add footer
  doc.setFontSize(8)
  doc.text('Thank you for your business!', 20, 280)
  
  return doc
}