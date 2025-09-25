# Quick Validation Reference

## Auth - Registration

- fullName: 2-100 chars
- email: valid email format
- password: min 6 chars
- phone: exactly 10 digits
- residentType: Owner|Tenant
- wing: [A-F] (optional)
- flatNumber: [1-14][01-04] (optional)
- age: 18-120 (optional)

## Vehicle

- vehicleType: Car|Bike|EV|Truck|Bus
- vehicleName: 2-50 chars
- vehicleModel: 1-50 chars
- vehicleColor: 1-30 chars
- vehicleNumber: XX00XX0000 format
- parkingSlot: X-NUM-P[1-2] (optional)

## Notice

- title: 5-255 chars
- description: min 10 chars
- priority: low|medium|high (optional)
- category: general|maintenance|security|event|payment|other (optional)

## Complaint

- title: 5-255 chars
- description: min 10 chars
- category: plumbing|electrical|security|maintenance|noise|parking|cleaning|other
- priority: low|medium|high|urgent (optional)

## Family Member

- fullName: 2-100 chars
- relation: 2-50 chars
- phone: 10 digits (optional)
- email: valid format (optional)
- age: 0-120 (optional)
- gender: Male|Female|Other (optional)

## Admin Actions

- Status Updates: Valid ObjectId + approved|rejected|pending
- Complaint Status: Valid ObjectId + open|in_progress|resolved|closed