## Error Type
Runtime ReferenceError

## Error Message
DIAGNOSIS_DATA is not defined


    at ActiveTreatmentCard (app/components/ActiveTreatmentCard.tsx:26:7)
    at ReportPage (app/report/[id]/page.tsx:69:9)

## Code Frame
  24 |         icon: med.type === 'oral' ? <Pill size={20} /> : <FlaskConical size={20} />
  25 |       }))
> 26 |     : DIAGNOSIS_DATA.treatments;
     |       ^
  27 |
  28 |   return (
  29 |     <FadeInCard delay={0}>

Next.js version: 16.1.6 (Turbopack)
