// index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const prisma = new PrismaClient();
const cors = require('cors');
const ExcelJS = require('exceljs');
const app = express();
// const students=require('./array.js')

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
    res.render('index');
  });

// Bulk add student data
app.post('/students', async (req, res) => {
  const generateStudents = (count) => {
    const students = [];
    for (let i = 1; i <= count; i++) {
      students.push({
        name: `Student ${i}`,
        age: 18 + (i % 5), // Random age between 18-22
        email: `student${i}@example.com`,
        phoneNumber: `123456789${i}`, // Unique phone number
        address: `Address ${i}`,
        dateOfBirth: new Date(2000 + (i % 5), i % 12, i % 28), // Random date of birth
        enrollmentDate: new Date(), // Current date as enrollment date
        course: `Course ${(i % 5) + 1}`, // Courses 1-5
        grade: ['A', 'B', 'C', 'D', 'F'][i % 5], // Grades from A to F
        isActive: i % 2 === 0, // Alternating active/inactive
        guardianName: `Guardian ${i}`,
        guardianPhone: `987654321${i}`,
        gender: i % 2 === 0 ? 'Male' : 'Female', // Alternating gender
        nationality: ['Indian', 'American', 'Canadian', 'British', 'Australian'][i % 5], // 5 nationalities
        profileImageUrl: `https://example.com/profile${i}.jpg`, // Sample image URL
        createdAt: new Date(), // Current date
      });
    }

    return students;
  };

  const studentArray = generateStudents(200000);

  try {
    const createdStudents = await prisma.student.createMany({
      data: studentArray,
      skipDuplicates: true, // Skip records if email is a duplicate
    });
    res.status(200).json({ message: `${createdStudents.count} students created successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


app.post('/download', async (req, res) => {
    try {
      // Fetch student data from the database
      const {students}=req.body
      // console.log(req.body)
      // console.log(students)

      if(!students)
      {
        return res.status(404).json({message:"No Data Found"})
      }

    // const students=[{
    //     "institute_id": 1,
    //     "email_of_institute": "kunjumol1@butomy.in",
    //     "institute_name": "IHRD College Of Engineeringg",
    //     "registration_date": "2024-07-22",
    //     "student_count": 13,
    //     "institute_unique_id": "YIPAG00001",
    //     "institution_category": null,
    //     "administrative_control": {
    //       "id": 1,
    //       "name": "Directorate of Employment and Training - Government",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "name_of_head": "Ananthu",
    //     "email_of_head": "kunjumol1@butomy.in",
    //     "contact_of_head": "+918547971477",
    //     "designation_of_head": "Principleh",
    //     "address_of_institute": "Kollam tholpikan avula, Kerala · 0481 242 0025",
    //     "district_id": 2,
    //     "pincode": "673521",
    //     "local_body_id": 1042,
    //     "local_body_type_id": 1,
    //     "block_id": 13,
    //     "institution_type": {
    //       "id": 1,
    //       "name": "Ncvt",
    //       "created_at": "2024-06-11T09:20:16.000000Z",
    //       "updated_at": "2024-06-11T09:20:16.000000Z",
    //       "deleted_at": null,
    //       "constant": null
    //     },
    //     "finance_type": {
    //       "id": 1,
    //       "name": "Government",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "institute_type": 1
    //     },
    //     "academic_control": {
    //       "id": 1,
    //       "name": "NCVT",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "administrative_control": 1,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "school_subcategory_id": 1,
    //     "sametham_id": "fggg",
    //     "spark_id": "ifi",
    //     "brc_id": 1,
    //     "old_institute_id": "22403",
    //     "district": {
    //       "id": 2,
    //       "name": "Kollam",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "district_code": "B"
    //     },
    //     "local_body": null,
    //     "local_body_type": {
    //       "id": 1,
    //       "name": "Grama Panchayath",
    //       "created_at": "2023-12-22T07:20:29.000000Z",
    //       "updated_at": "2023-12-22T07:20:29.000000Z",
    //       "deleted_at": null
    //     },
    //     "institute_pocs": [],
    //     "institute_facilitator": [],
    //     "block": {
    //       "id": 13,
    //       "name": "Parassala Block",
    //       "district_id": 1,
    //       "created_at": "2024-06-14T06:25:52.000000Z",
    //       "updated_at": "2024-06-14T06:25:52.000000Z",
    //       "deleted_at": null
    //     },
    //     "sub_category": {
    //       "id": 1,
    //       "institute_type_id": 2,
    //       "name": "Higher Secondary School",
    //       "created_at": "2024-06-14T05:46:45.000000Z",
    //       "updated_at": "2024-06-14T05:46:45.000000Z",
    //       "deleted_at": null
    //     },
    //     "brc_name": {
    //       "id": 1,
    //       "name": "ATTINGAL",
    //       "created_at": "2024-01-18T08:46:21.000000Z",
    //       "updated_at": "2024-01-18T08:46:21.000000Z",
    //       "deleted_at": null,
    //       "district_id": 1
    //     }
    //   },
    //   {
    //     "institute_id": 1,
    //     "email_of_institute": "kunjumol1@butomy.in",
    //     "institute_name": "IHRD College Of Engineeringg",
    //     "registration_date": "2024-07-22",
    //     "student_count": 13,
    //     "institute_unique_id": "YIPAG00001",
    //     "institution_category": null,
    //     "administrative_control": {
    //       "id": 1,
    //       "name": "Directorate of Employment and Training - Government",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "name_of_head": "Ananthu",
    //     "email_of_head": "kunjumol1@butomy.in",
    //     "contact_of_head": "+918547971477",
    //     "designation_of_head": "Principleh",
    //     "address_of_institute": "Kollam tholpikan avula, Kerala · 0481 242 0025",
    //     "district_id": 2,
    //     "pincode": "673521",
    //     "local_body_id": 1042,
    //     "local_body_type_id": 1,
    //     "block_id": 13,
    //     "institution_type": {
    //       "id": 1,
    //       "name": "Ncvt",
    //       "created_at": "2024-06-11T09:20:16.000000Z",
    //       "updated_at": "2024-06-11T09:20:16.000000Z",
    //       "deleted_at": null,
    //       "constant": null
    //     },
    //     "finance_type": {
    //       "id": 1,
    //       "name": "Government",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "institute_type": 1
    //     },
    //     "academic_control": {
    //       "id": 1,
    //       "name": "NCVT",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "administrative_control": 1,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "school_subcategory_id": 1,
    //     "sametham_id": "fggg",
    //     "spark_id": "ifi",
    //     "brc_id": 1,
    //     "old_institute_id": "22403",
    //     "district": {
    //       "id": 2,
    //       "name": "Kollam",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "district_code": "B"
    //     },
    //     "local_body": null,
    //     "local_body_type": {
    //       "id": 1,
    //       "name": "Grama Panchayath",
    //       "created_at": "2023-12-22T07:20:29.000000Z",
    //       "updated_at": "2023-12-22T07:20:29.000000Z",
    //       "deleted_at": null
    //     },
    //     "institute_pocs": [],
    //     "institute_facilitator": [],
    //     "block": {
    //       "id": 13,
    //       "name": "Parassala Block",
    //       "district_id": 1,
    //       "created_at": "2024-06-14T06:25:52.000000Z",
    //       "updated_at": "2024-06-14T06:25:52.000000Z",
    //       "deleted_at": null
    //     },
    //     "sub_category": {
    //       "id": 1,
    //       "institute_type_id": 2,
    //       "name": "Higher Secondary School",
    //       "created_at": "2024-06-14T05:46:45.000000Z",
    //       "updated_at": "2024-06-14T05:46:45.000000Z",
    //       "deleted_at": null
    //     },
    //     "brc_name": {
    //       "id": 1,
    //       "name": "ATTINGAL",
    //       "created_at": "2024-01-18T08:46:21.000000Z",
    //       "updated_at": "2024-01-18T08:46:21.000000Z",
    //       "deleted_at": null,
    //       "district_id": 1
    //     }
    //   },
    //   {
    //     "institute_id": 1,
    //     "email_of_institute": "kunjumol1@butomy.in",
    //     "institute_name": "IHRD College Of Engineeringg",
    //     "registration_date": "2024-07-22",
    //     "student_count": 13,
    //     "institute_unique_id": "YIPAG00001",
    //     "institution_category": null,
    //     "administrative_control": {
    //       "id": 1,
    //       "name": "Directorate of Employment and Training - Government",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "name_of_head": "Ananthu",
    //     "email_of_head": "kunjumol1@butomy.in",
    //     "contact_of_head": "+918547971477",
    //     "designation_of_head": "Principleh",
    //     "address_of_institute": "Kollam tholpikan avula, Kerala · 0481 242 0025",
    //     "district_id": 2,
    //     "pincode": "673521",
    //     "local_body_id": 1042,
    //     "local_body_type_id": 1,
    //     "block_id": 13,
    //     "institution_type": {
    //       "id": 1,
    //       "name": "Ncvt",
    //       "created_at": "2024-06-11T09:20:16.000000Z",
    //       "updated_at": "2024-06-11T09:20:16.000000Z",
    //       "deleted_at": null,
    //       "constant": null
    //     },
    //     "finance_type": {
    //       "id": 1,
    //       "name": "Government",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "institute_type": 1
    //     },
    //     "academic_control": {
    //       "id": 1,
    //       "name": "NCVT",
    //       "institute_type": 1,
    //       "finance_type": 1,
    //       "institution_category": 225,
    //       "administrative_control": 1,
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null
    //     },
    //     "school_subcategory_id": 1,
    //     "sametham_id": "fggg",
    //     "spark_id": "ifi",
    //     "brc_id": 1,
    //     "old_institute_id": "22403",
    //     "district": {
    //       "id": 2,
    //       "name": "Kollam",
    //       "created_at": null,
    //       "updated_at": null,
    //       "deleted_at": null,
    //       "district_code": "B"
    //     },
    //     "local_body": null,
    //     "local_body_type": {
    //       "id": 1,
    //       "name": "Grama Panchayath",
    //       "created_at": "2023-12-22T07:20:29.000000Z",
    //       "updated_at": "2023-12-22T07:20:29.000000Z",
    //       "deleted_at": null
    //     },
    //     "institute_pocs": [],
    //     "institute_facilitator": [],
    //     "block": {
    //       "id": 13,
    //       "name": "Parassala Block",
    //       "district_id": 1,
    //       "created_at": "2024-06-14T06:25:52.000000Z",
    //       "updated_at": "2024-06-14T06:25:52.000000Z",
    //       "deleted_at": null
    //     },
    //     "sub_category": {
    //       "id": 1,
    //       "institute_type_id": 2,
    //       "name": "Higher Secondary School",
    //       "created_at": "2024-06-14T05:46:45.000000Z",
    //       "updated_at": "2024-06-14T05:46:45.000000Z",
    //       "deleted_at": null
    //     },
    //     "brc_name": {
    //       "id": 1,
    //       "name": "ATTINGAL",
    //       "created_at": "2024-01-18T08:46:21.000000Z",
    //       "updated_at": "2024-01-18T08:46:21.000000Z",
    //       "deleted_at": null,
    //       "district_id": 1
    //     }
    //   }]
  
      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Students');
  
      // Define columns
      worksheet.columns = [
        { header: 'YIP Institute ID', key: 'institute_unique_id', width: 30 },
        { header: 'Institute Name', key: 'institute_name', width: 30 },
        { header: 'Institute Email', key: 'email_of_institute', width: 30 },
        { header: 'Registered Date', key: 'registration_date', width: 20 },
        { header: 'Student Count', key: 'student_count', width: 15 },
        { header: 'Category', key: 'institution_category', width: 30 },
        { header: 'Head Name', key: 'name_of_head', width: 30 },
        { header: 'Head Email', key: 'email_of_head', width: 30 },
        { header: 'Contact of Head', key: 'contact_of_head', width: 20 },
        { header: 'Designation of Head', key: 'designation_of_head', width: 30 },
        { header: 'Address', key: 'address_of_institute', width: 40 },
        { header: 'District', key: 'district', width: 15 },
        { header: 'Pincode', key: 'pincode', width: 15 },
        { header: 'Local Body Type', key: 'local_body_type_name', width: 30 },
        { header: 'Local Body', key: 'local_body', width: 20 },
        { header: 'Block', key: 'block', width: 15 },
        { header: 'Institution Type', key: 'institution_type_name', width: 30 },
        { header: 'Finance Type', key: 'finance_type_name', width: 30 },
        { header: 'Administrative Control Name', key: 'administrative_control_name', width: 30 },
        { header: 'Academic Control', key: 'academic_control_name', width: 30 },
        { header: 'Subcategory', key: 'school_subcategory', width: 20 },
        { header: 'Sametham ID', key: 'sametham_id', width: 20 },
        { header: 'BRC Name', key: 'brc', width: 15 },
        { header: 'Old Institute ID', key: 'old_institute_id', width: 20 },
        { header: 'District Name', key: 'district_name', width: 20 },
        { header: 'BRC Name', key: 'brc_name', width: 20 },
    ];
  
      // Add rows
      students.forEach(student => {
        worksheet.addRow({
            institute_unique_id: student.institute_unique_id,
            email_of_institute: student.email_of_institute,
            institute_name: student.institute_name,
            registration_date: student.registration_date,
            student_count: student.student_count,
            institution_category: student.institution_category || '',
            administrative_control_name: student.administrative_control?.name,
            name_of_head: student.name_of_head,
            email_of_head: student.email_of_head,
            contact_of_head: student.contact_of_head,
            designation_of_head: student.designation_of_head,
            address_of_institute: student.address_of_institute,
            district: student.district?.name,
            pincode: student.pincode,
            local_body_type_name: student.local_body_type?.name || '',
            local_body: student.local_body,
            block: student.block?.name,
            institution_type_name: student.institution_type?.name,
            finance_type_name: student.finance_type?.name,
            academic_control_name: student.academic_control?.name,
            school_subcategory: student.sub_category?.name,
            sametham_id: student.sametham_id,
            brc: student?.brc_name?.name,
            old_institute_id: student.old_institute_id,
            district_name: student.district?.name,
            brc_name: student?.brc_name?.name,
        });
    });
  
      // Set content-type and disposition to handle file download
      res.setHeader('Content-Disposition', 'attachment; filename=detailsbydate.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
      // Write the file to the response
      try
      {
        await workbook.xlsx.write(res);
      }
      catch(error)
      {
        console.log(error)
        throw error
      }
      res.status(200).end();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });

  app.get('/students', async (req, res) => {
    try {
      // Fetch all students from the database
      const students = await prisma.student.findMany({
        select: {
          id: true,
          name: true,
          age: true,
          email: true,
          phoneNumber: true,
          address: true,
          dateOfBirth: true,
          enrollmentDate: true,
          course: true,
          grade: true,
          isActive: true,
          guardianName: true,
          guardianPhone: true,
          gender: true,
          nationality: true,
          profileImageUrl: true,
          createdAt: true,
        },
        take:5000
      });
  
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Something went wrong while fetching students.' });
    }
  });

// Start the server
app.listen(8000, () => {
  console.log('Server is running on http://localhost:3000');
});
