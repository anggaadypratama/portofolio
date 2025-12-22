import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 0, // Full bleed
    fontFamily: 'Helvetica',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  // Left Sidebar
  sidebar: {
    width: '32%',
    backgroundColor: '#111827', // Dark Gray / Black
    color: '#F3F4F6',
    padding: 20,
    height: '100%',
  },
  sidebarHeader: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EAB308', // Primary
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 15,
    letterSpacing: 1,
  }, 
  contactItem: {
    fontSize: 9,
    marginBottom: 6,
    color: '#D1D5DB',
  },
  skillItem: {
    backgroundColor: '#374151',
    color: '#F3F4F6',
    padding: '4 8',
    marginBottom: 6,
    fontSize: 9,
    borderRadius: 4,
    textAlign: 'center',
  },
  // Compact skill items
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  compactSkillItem: {
    backgroundColor: '#374151',
    color: '#F3F4F6',
    padding: '3 6',
    marginRight: 4,
    marginBottom: 4,
    fontSize: 8,
    borderRadius: 3,
  },
  
  // Right Content
  main: {
    width: '68%',
    padding: 30,
    paddingTop: 40,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111827',
    marginBottom: 2,
    letterSpacing: -1,
  },
  roleTitle: {
    fontSize: 12,
    color: '#EAB308', // Primary
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#EAB308',
    paddingBottom: 4,
    marginBottom: 15,
    marginTop: 10,
    width: '100%',
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 20,
  },
  
  // Experience Item
  expItem: {
    marginBottom: 15,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align vertically
    marginBottom: 2,
  },
  expCompany: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  expDate: {
    fontSize: 9,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  expRole: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EAB308',
    marginBottom: 4,
  },
  expDesc: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  expTech: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 4,
  },
});

interface CVDocumentProps {
  data: {
    hero: {
      headlineLine1: string;
      headlineLine2: string;
      introParagraph: string;
    } | null;
    contact: {
      primaryEmail: string;
      linkedinUrl: string | null;
      githubUrl: string | null;
    } | null;
    experience: Array<{
      id: string;
      company: string;
      role: string;
      duration: string;
      description: string;
      techStack: string[];
    }>;
    skills: Array<{
      name: string;
    }>;
    tools: Array<{
      name: string;
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      duration: string;
      description: string | null;
    }>;
  };
}

export const CVDocument: React.FC<CVDocumentProps> = ({ data }) => {
  const { hero, contact, experience, skills, tools, education } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
            {/* Contact Info */}
            <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Contact</Text>
                {contact?.primaryEmail && (
                  <Text style={styles.contactItem}>{contact.primaryEmail}</Text>
                )}
                 {contact?.linkedinUrl && (
                  <Text style={styles.contactItem}>Linkedin:  {contact.linkedinUrl.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', '')}</Text>
                )}
                {contact?.githubUrl && (
                  <Text style={styles.contactItem}>Github: {contact.githubUrl.replace('https://github.com/', '')}</Text>
                )}
            </View>

            {/* Skills */}
            <View>
                <Text style={styles.sidebarTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                    {skills.map((skill, index) => (
                        <Text key={index} style={styles.compactSkillItem}>
                            {skill.name}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Tools & Core */}
            <View>
                <Text style={styles.sidebarTitle}>Tools & Core</Text>
                <View style={styles.skillsContainer}>
                    {tools.map((tool, index) => (
                        <Text key={index} style={styles.compactSkillItem}>
                            {tool.name}
                        </Text>
                    ))}
                </View>
            </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
            {/* Header */}
            <View>
                <Text style={styles.name}>
                    {hero ? `${hero.headlineLine1} ${hero.headlineLine2}` : 'ANGGA ADY PRATAMA'}
                </Text>
                <Text style={styles.roleTitle}>Web Developer</Text>
                
                <Text style={styles.summaryText}>
                    {hero?.introParagraph || 'Passionate web developer experienced in building modern applications.'}
                </Text>
            </View>

            {/* Experience */}
            <View>
                <Text style={styles.sectionTitle}>Experience</Text>
                {experience.map((exp) => (
                    <View key={exp.id} style={styles.expItem}>
                        <View style={styles.expHeader}>
                            <Text style={styles.expCompany}>{exp.company}</Text>
                            <Text style={styles.expDate}>{exp.duration}</Text>
                        </View>
                        <Text style={styles.expRole}>{exp.role}</Text>
                        <Text style={styles.expDesc}>{exp.description}</Text>
                        <Text style={styles.expTech}>
                             {exp.techStack.join(' • ')}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Education */}
            {education && education.length > 0 && (
              <View>
                  <Text style={styles.sectionTitle}>Education</Text>
                  {education.map((edu) => (
                      <View key={edu.id} style={styles.expItem}>
                          <View style={styles.expHeader}>
                              <Text style={styles.expCompany}>{edu.institution}</Text>
                              <Text style={styles.expDate}>{edu.duration}</Text>
                          </View>
                          <Text style={styles.expRole}>{edu.degree} in {edu.field}</Text>
                          {edu.description && (
                            <Text style={styles.expDesc}>{edu.description}</Text>
                          )}
                      </View>
                  ))}
              </View>
            )}
        </View>

      </Page>
    </Document>
  );
};
