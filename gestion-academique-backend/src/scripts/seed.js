require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Import models
const User = require("../models/User.model");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");
const Groupe = require("../models/Groupe.model");
const Course = require("../models/Course.model");
const Enrollment = require("../models/Enrollment.model");
const Assessment = require("../models/Assessment.model");
const Grade = require("../models/Grade.model");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("❌ MONGO_URI is missing in .env");
  }
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
};

const clearDatabase = async () => {
  console.log("🗑️  Clearing database...");
  await User.deleteMany({});
  await Teacher.deleteMany({});
  await Student.deleteMany({});
  await Groupe.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Assessment.deleteMany({});
  await Grade.deleteMany({});
  console.log("✅ Database cleared");
};

const seedDatabase = async () => {
  const accounts = [];

  try {
    await connectDB();
    await clearDatabase();

    console.log("🌱 Seeding database...");

    // 1. Create Groups
    console.log("📚 Creating groups...");
    const groupes = await Groupe.insertMany([
      {
        name: "GL5-1",
        level: "5ème année",
        year: 2024,
        department: "Génie Logiciel"
      },
      {
        name: "GL5-2",
        level: "5ème année",
        year: 2024,
        department: "Génie Logiciel"
      },
      {
        name: "GL4-1",
        level: "4ème année",
        year: 2024,
        department: "Génie Logiciel"
      },
      {
        name: "DSI5-1",
        level: "5ème année",
        year: 2024,
        department: "Décisionnel et Systèmes d'Information"
      }
    ]);
    console.log(`✅ Created ${groupes.length} groups`);

    // 2. Create Admin
    console.log("👤 Creating admin...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      email: "admin@school.com",
      password: adminPassword,
      role: "ADMIN"
    });
    accounts.push({
      role: "ADMIN",
      email: "admin@school.com",
      password: "admin123",
      name: "Administrateur"
    });
    console.log("✅ Admin created");

    // 3. Create Teachers
    console.log("👨‍🏫 Creating teachers...");
    const teachersData = [
      {
        email: "prof1@school.com",
        password: "teacher123",
        firstName: "Ahmed",
        lastName: "Benali",
        teacherCode: "TCH-001",
        specialty: "Développement Web"
      },
      {
        email: "prof2@school.com",
        password: "teacher123",
        firstName: "Fatima",
        lastName: "Alaoui",
        teacherCode: "TCH-002",
        specialty: "Base de Données"
      },
      {
        email: "prof3@school.com",
        password: "teacher123",
        firstName: "Mohamed",
        lastName: "Tazi",
        teacherCode: "TCH-003",
        specialty: "Intelligence Artificielle"
      },
      {
        email: "prof4@school.com",
        password: "teacher123",
        firstName: "Sanae",
        lastName: "Idrissi",
        teacherCode: "TCH-004",
        specialty: "Réseaux"
      }
    ];

    const teachers = [];
    for (const teacherData of teachersData) {
      const hashedPassword = await bcrypt.hash(teacherData.password, 10);
      const user = await User.create({
        email: teacherData.email,
        password: hashedPassword,
        role: "TEACHER"
      });
      const teacher = await Teacher.create({
        user: user._id,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        teacherCode: teacherData.teacherCode,
        specialty: teacherData.specialty
      });
      teachers.push(teacher);
      accounts.push({
        role: "TEACHER",
        email: teacherData.email,
        password: teacherData.password,
        name: `${teacherData.firstName} ${teacherData.lastName}`,
        teacherCode: teacherData.teacherCode,
        specialty: teacherData.specialty
      });
    }
    console.log(`✅ Created ${teachers.length} teachers`);

    // 4. Create Students
    console.log("👨‍🎓 Creating students...");
    const studentsData = [
      {
        email: "student1@school.com",
        password: "student123",
        firstName: "Youssef",
        lastName: "Amrani",
        studentNumber: "STD-001",
        groupe: groupes[0]._id
      },
      {
        email: "student2@school.com",
        password: "student123",
        firstName: "Aicha",
        lastName: "Bennani",
        studentNumber: "STD-002",
        groupe: groupes[0]._id
      },
      {
        email: "student3@school.com",
        password: "student123",
        firstName: "Omar",
        lastName: "Chraibi",
        studentNumber: "STD-003",
        groupe: groupes[0]._id
      },
      {
        email: "student4@school.com",
        password: "student123",
        firstName: "Laila",
        lastName: "Dahbi",
        studentNumber: "STD-004",
        groupe: groupes[1]._id
      },
      {
        email: "student5@school.com",
        password: "student123",
        firstName: "Karim",
        lastName: "El Fassi",
        studentNumber: "STD-005",
        groupe: groupes[1]._id
      },
      {
        email: "student6@school.com",
        password: "student123",
        firstName: "Nadia",
        lastName: "Hamdi",
        studentNumber: "STD-006",
        groupe: groupes[2]._id
      },
      {
        email: "student7@school.com",
        password: "student123",
        firstName: "Hassan",
        lastName: "Kadiri",
        studentNumber: "STD-007",
        groupe: groupes[2]._id
      },
      {
        email: "student8@school.com",
        password: "student123",
        firstName: "Sara",
        lastName: "Lamrani",
        studentNumber: "STD-008",
        groupe: groupes[3]._id
      }
    ];

    const students = [];
    for (const studentData of studentsData) {
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const user = await User.create({
        email: studentData.email,
        password: hashedPassword,
        role: "STUDENT"
      });
      const student = await Student.create({
        user: user._id,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        studentNumber: studentData.studentNumber,
        groupe: studentData.groupe
      });
      students.push(student);
      accounts.push({
        role: "STUDENT",
        email: studentData.email,
        password: studentData.password,
        name: `${studentData.firstName} ${studentData.lastName}`,
        studentNumber: studentData.studentNumber,
        groupe: groupes.find(g => g._id.toString() === studentData.groupe.toString())?.name
      });
    }
    console.log(`✅ Created ${students.length} students`);

    // 5. Create Courses
    console.log("📖 Creating courses...");
    const coursesData = [
      {
        title: "Développement Web Full Stack",
        description: "Apprentissage des technologies web modernes (React, Node.js, MongoDB)",
        credits: 6,
        teacher: teachers[0]._id
      },
      {
        title: "Base de Données Avancées",
        description: "Conception et optimisation de bases de données relationnelles et NoSQL",
        credits: 4,
        teacher: teachers[1]._id
      },
      {
        title: "Intelligence Artificielle",
        description: "Introduction au machine learning et deep learning",
        credits: 5,
        teacher: teachers[2]._id
      },
      {
        title: "Réseaux et Sécurité",
        description: "Architecture réseau, protocoles et sécurité informatique",
        credits: 4,
        teacher: teachers[3]._id
      },
      {
        title: "Framework JavaScript",
        description: "Angular, Vue.js et React - Développement d'applications SPA",
        credits: 5,
        teacher: teachers[0]._id
      },
      {
        title: "Big Data",
        description: "Traitement et analyse de grandes quantités de données",
        credits: 4,
        teacher: teachers[1]._id
      }
    ];

    const courses = await Course.insertMany(coursesData);
    console.log(`✅ Created ${courses.length} courses`);

    // 6. Create Enrollments
    console.log("📝 Creating enrollments...");
    const enrollments = [];
    
    // Students from GL5-1 enroll in first 3 courses
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        enrollments.push({
          student: students[i]._id,
          course: courses[j]._id,
          status: "ACTIVE"
        });
      }
    }

    // Students from GL5-2 enroll in courses 0, 1, 3
    for (let i = 3; i < 5; i++) {
      enrollments.push({
        student: students[i]._id,
        course: courses[0]._id,
        status: "ACTIVE"
      });
      enrollments.push({
        student: students[i]._id,
        course: courses[1]._id,
        status: "ACTIVE"
      });
      enrollments.push({
        student: students[i]._id,
        course: courses[3]._id,
        status: "ACTIVE"
      });
    }

    // Students from GL4-1 enroll in courses 2, 4
    for (let i = 5; i < 7; i++) {
      enrollments.push({
        student: students[i]._id,
        course: courses[2]._id,
        status: "ACTIVE"
      });
      enrollments.push({
        student: students[i]._id,
        course: courses[4]._id,
        status: "ACTIVE"
      });
    }

    // Student from DSI5-1 enrolls in course 5
    enrollments.push({
      student: students[7]._id,
      course: courses[5]._id,
      status: "ACTIVE"
    });

    await Enrollment.insertMany(enrollments);
    console.log(`✅ Created ${enrollments.length} enrollments`);

    // 7. Create Assessments
    console.log("📋 Creating assessments...");
    const assessments = [];
    
    // Assessments for course 0 (Développement Web)
    assessments.push({
      course: courses[0]._id,
      title: "DS1 - HTML/CSS",
      type: "Contrôle",
      date: new Date("2024-10-15"),
      weight: 0.2
    });
    assessments.push({
      course: courses[0]._id,
      title: "DS2 - JavaScript",
      type: "Contrôle",
      date: new Date("2024-11-10"),
      weight: 0.3
    });
    assessments.push({
      course: courses[0]._id,
      title: "Projet Final",
      type: "Projet",
      date: new Date("2024-12-20"),
      weight: 0.5
    });

    // Assessments for course 1 (Base de Données)
    assessments.push({
      course: courses[1]._id,
      title: "DS1 - Modélisation",
      type: "Contrôle",
      date: new Date("2024-10-20"),
      weight: 0.3
    });
    assessments.push({
      course: courses[1]._id,
      title: "Examen Final",
      type: "Examen",
      date: new Date("2024-12-15"),
      weight: 0.7
    });

    // Assessments for course 2 (IA)
    assessments.push({
      course: courses[2]._id,
      title: "TP1 - Machine Learning",
      type: "TP",
      date: new Date("2024-11-05"),
      weight: 0.25
    });
    assessments.push({
      course: courses[2]._id,
      title: "TP2 - Deep Learning",
      type: "TP",
      date: new Date("2024-11-25"),
      weight: 0.25
    });
    assessments.push({
      course: courses[2]._id,
      title: "Examen Final",
      type: "Examen",
      date: new Date("2024-12-18"),
      weight: 0.5
    });

    // Assessments for course 3 (Réseaux)
    assessments.push({
      course: courses[3]._id,
      title: "DS1 - Protocoles",
      type: "Contrôle",
      date: new Date("2024-10-25"),
      weight: 0.4
    });
    assessments.push({
      course: courses[3]._id,
      title: "Projet Sécurité",
      type: "Projet",
      date: new Date("2024-12-10"),
      weight: 0.6
    });

    const createdAssessments = await Assessment.insertMany(assessments);
    console.log(`✅ Created ${createdAssessments.length} assessments`);

    // 8. Create Grades
    console.log("📊 Creating grades...");
    const grades = [];
    
    // Get enrollments for each course to assign grades
    for (const assessment of createdAssessments) {
      const courseEnrollments = enrollments.filter(
        e => e.course.toString() === assessment.course.toString()
      );
      
      // Get teacher for this course
      const course = courses.find(c => c._id.toString() === assessment.course.toString());
      const teacher = teachers.find(t => t._id.toString() === course.teacher.toString());
      
      // Assign random grades between 8 and 18
      for (const enrollment of courseEnrollments) {
        const gradeValue = Math.round((Math.random() * 10 + 8) * 10) / 10; // Between 8 and 18
        grades.push({
          student: enrollment.student,
          assessment: assessment._id,
          teacher: teacher._id,
          value: gradeValue
        });
      }
    }

    await Grade.insertMany(grades);
    console.log(`✅ Created ${grades.length} grades`);

    // 9. Generate accounts file
    console.log("📄 Generating accounts file...");
    const accountsContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    COMPTES DE TEST - GESTION ACADÉMIQUE                      ║
╚══════════════════════════════════════════════════════════════════════════════╝

📅 Date de création: ${new Date().toLocaleString('fr-FR')}

═══════════════════════════════════════════════════════════════════════════════
👤 ADMINISTRATEUR
═══════════════════════════════════════════════════════════════════════════════
Email: admin@school.com
Mot de passe: admin123
Rôle: ADMINISTRATEUR

═══════════════════════════════════════════════════════════════════════════════
👨‍🏫 ENSEIGNANTS (TEACHERS)
═══════════════════════════════════════════════════════════════════════════════
${accounts.filter(a => a.role === "TEACHER").map((acc, idx) => `
${idx + 1}. ${acc.name}
   Email: ${acc.email}
   Mot de passe: ${acc.password}
   Code: ${acc.teacherCode}
   Spécialité: ${acc.specialty}
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
👨‍🎓 ÉTUDIANTS (STUDENTS)
═══════════════════════════════════════════════════════════════════════════════
${accounts.filter(a => a.role === "STUDENT").map((acc, idx) => `
${idx + 1}. ${acc.name}
   Email: ${acc.email}
   Mot de passe: ${acc.password}
   Numéro étudiant: ${acc.studentNumber}
   Groupe: ${acc.groupe}
`).join('')}

═══════════════════════════════════════════════════════════════════════════════
📊 RÉSUMÉ DES DONNÉES CRÉÉES
═══════════════════════════════════════════════════════════════════════════════
• ${groupes.length} Groupes
• ${teachers.length} Enseignants
• ${students.length} Étudiants
• ${courses.length} Cours
• ${enrollments.length} Inscriptions
• ${createdAssessments.length} Évaluations
• ${grades.length} Notes

═══════════════════════════════════════════════════════════════════════════════
📝 NOTES IMPORTANTES
═══════════════════════════════════════════════════════════════════════════════
• Tous les mots de passe sont en clair dans ce fichier pour faciliter les tests
• En production, ces mots de passe doivent être changés
• Chaque enseignant ne peut voir que ses propres cours
• Les étudiants peuvent voir tous les cours disponibles pour s'inscrire
• Les notes sont générées aléatoirement entre 8 et 18

═══════════════════════════════════════════════════════════════════════════════
`;

    const accountsFilePath = path.join(__dirname, "../../COMPTES_TEST.txt");
    fs.writeFileSync(accountsFilePath, accountsContent, "utf8");
    console.log(`✅ Accounts file created: ${accountsFilePath}`);

    // Also create JSON file
    const jsonContent = {
      generatedAt: new Date().toISOString(),
      accounts: accounts,
      summary: {
        groups: groupes.length,
        teachers: teachers.length,
        students: students.length,
        courses: courses.length,
        enrollments: enrollments.length,
        assessments: createdAssessments.length,
        grades: grades.length
      }
    };
    
    const jsonFilePath = path.join(__dirname, "../../COMPTES_TEST.json");
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), "utf8");
    console.log(`✅ JSON file created: ${jsonFilePath}`);

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - ${groupes.length} Groups`);
    console.log(`   - ${teachers.length} Teachers`);
    console.log(`   - ${students.length} Students`);
    console.log(`   - ${courses.length} Courses`);
    console.log(`   - ${enrollments.length} Enrollments`);
    console.log(`   - ${createdAssessments.length} Assessments`);
    console.log(`   - ${grades.length} Grades`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  }
};

// Run seed
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seed completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed failed:", error);
      process.exit(1);
    });
}

module.exports = seedDatabase;


