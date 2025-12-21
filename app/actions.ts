"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = sessionToken ? await decrypt(sessionToken) : null;

  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

// --- GET ALL PORTFOLIO DATA ---
export async function getPortfolio() {
  // Publicly accessible if used by landing page, otherwise can protect.
  // Assuming safe to read for now, or let's verify if landing page uses it.
  const [hero, about, experience, skills, tools, contact] = await Promise.all([
    prisma.heroSection.findFirst(),
    prisma.aboutSection.findFirst(),
    prisma.experienceEntry.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: { order: "asc" } }),
    prisma.tool.findMany({ orderBy: { order: "asc" } }),
    prisma.contactInfo.findFirst(),
  ]);

  return {
    hero: hero || {},
    about: about || {},
    experience: experience || [],
    skills: skills || [],
    tools: tools || [],
    contact: contact || { id: 1 },
  };
}

// --- GET PAGINATED EXPERIENCE ---
export async function getExperiencePaginated(page: number = 1, limit: number = 5) {
  const skip = (page - 1) * limit;
  
  const [experience, total] = await Promise.all([
    prisma.experienceEntry.findMany({
      orderBy: { order: "asc" },
      skip,
      take: limit,
    }),
    prisma.experienceEntry.count(),
  ]);

  return {
    items: experience || [],
    total,
    page,
    hasMore: skip + experience.length < total,
  };
}

// --- HERO SECTION ---
export async function updateHero(data: any) {
  await verifySession();
  const hero = await prisma.heroSection.upsert({
    where: { id: 1 },
    update: data,
    create: { ...data, id: 1 },
  });
  revalidatePath("/dashboard");
  revalidatePath("/");
  return hero;
}

// --- ABOUT SECTION ---
export async function updateAbout(data: any) {
  await verifySession();
  const about = await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: data,
    create: { ...data, id: 1 },
  });
  revalidatePath("/dashboard");
  revalidatePath("/");
  return about;
}

// --- EXPERIENCE SECTION ---
export async function saveExperience(data: any) {
  await verifySession();
  try {
    const { id, ...expData } = data;

    // Ensure correct types
    const formattedData = {
      ...expData,
      order: typeof expData.order === "string" ? parseInt(expData.order, 10) : expData.order,
      techStack: Array.isArray(expData.techStack) ? expData.techStack : [],
    };

    let result;
    if (id) {
      result = await prisma.experienceEntry.update({
        where: { id },
        data: formattedData,
      });
    } else {
      result = await prisma.experienceEntry.create({
        data: formattedData,
      });
    }
    revalidatePath("/dashboard");
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Error saving experience:", error);
    throw new Error("Failed to save experience");
  }
}

export async function deleteExperience(id: string) {
  await verifySession();
  try {
    await prisma.experienceEntry.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw new Error("Failed to delete experience");
  }
}

export async function reorderExperience(items: { id: string; order: number }[]) {
  await verifySession();
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.experienceEntry.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error reordering experience:", error);
    throw new Error("Failed to reorder experience");
  }
}

// --- SKILLS SECTION ---
export async function addSkill(name: string) {
  await verifySession();
  try {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return skill;
  } catch (error) {
    console.error("Error adding skill:", error);
    throw new Error("Failed to add skill");
  }
}

export async function deleteSkill(id: string) {
  await verifySession();
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw new Error("Failed to delete skill");
  }
}

// --- TOOLS SECTION ---
export async function addTool(name: string) {
  await verifySession();
  try {
    const tool = await prisma.tool.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return tool;
  } catch (error) {
    console.error("Error adding tool:", error);
    throw new Error("Failed to add tool");
  }
}

export async function deleteTool(id: string) {
  await verifySession();
  try {
    await prisma.tool.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tool:", error);
    throw new Error("Failed to delete tool");
  }
}

// --- CONTACT SECTION ---
export async function updateContact(data: any) {
  await verifySession();
  const contact = await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: data,
    create: { ...data, id: 1 },
  });
  revalidatePath("/dashboard");
  revalidatePath("/");
  return contact;
}
