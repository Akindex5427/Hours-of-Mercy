import { db } from "../src/firebase/config.js";
import {
  recurringEventsService,
  defaultRecurringTemplates,
} from "../src/firebase/recurringEventsService.js";

const seedRecurringEventTemplates = async () => {
  try {
    console.log("Starting to seed recurring event templates...");

    for (const template of defaultRecurringTemplates) {
      console.log(`Adding template: ${template.title}`);
      const id = await recurringEventsService.addTemplate(template);
      console.log(`✅ Added template "${template.title}" with ID: ${id}`);
    }

    console.log(
      "🎉 All recurring event templates have been seeded successfully!"
    );

    // List all templates to verify
    const templates = await recurringEventsService.getTemplates();
    console.log(`\n📋 Total templates in database: ${templates.length}`);
    templates.forEach((template) => {
      console.log(`- ${template.title} (${template.recurringType})`);
    });
  } catch (error) {
    console.error("❌ Error seeding recurring event templates:", error);
  }
};

// Run the seeding function
seedRecurringEventTemplates().then(() => {
  console.log("Seeding process completed.");
  process.exit(0);
});
