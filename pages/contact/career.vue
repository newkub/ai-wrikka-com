<script setup lang="ts">
interface JobPosition {
	id: number;
	title: string;
	type: "Full-time" | "Part-time" | "Contract" | "Internship";
	location: string;
	department: string;
	description: string;
	requirements: string[];
	isNew?: boolean;
}

const jobPositions: JobPosition[] = [
	{
		id: 1,
		title: "Senior Frontend Developer",
		type: "Full-time",
		location: "Bangkok, Thailand",
		department: "Engineering",
		description:
			"We are looking for an experienced Frontend Developer to join our growing team.",
		requirements: [
			"5+ years of experience with Vue.js/Nuxt.js",
			"Strong TypeScript skills",
			"Experience with modern CSS frameworks",
			"Good understanding of responsive design",
		],
		isNew: true,
	},
	{
		id: 2,
		title: "UX/UI Designer",
		type: "Full-time",
		location: "Remote",
		department: "Design",
		description:
			"Create beautiful and intuitive user experiences for our products.",
		requirements: [
			"3+ years of UX/UI design experience",
			"Proficiency in Figma or similar tools",
			"Strong portfolio showcasing your work",
			"Experience with design systems",
		],
	},
	{
		id: 3,
		title: "DevOps Engineer",
		type: "Full-time",
		location: "Bangkok, Thailand",
		department: "Engineering",
		description: "Help us build and maintain our cloud infrastructure.",
		requirements: [
			"Experience with AWS/GCP",
			"Kubernetes and Docker expertise",
			"CI/CD pipeline experience",
			"Infrastructure as Code (Terraform)",
		],
	},
];

const departments = ["All", "Engineering", "Design", "Marketing", "Product"];
const selectedDepartment = ref("All");

const filteredJobs = computed(() => {
	if (selectedDepartment.value === "All") return jobPositions;
	return jobPositions.filter(
		(job) => job.department === selectedDepartment.value,
	);
});
</script>

<template>
  <div class="space-y-8">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Join Our Team</h1>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        We're always looking for talented individuals to join our growing team.
      </p>
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-8">
      <button
        v-for="dept in departments"
        :key="dept"
        @click="selectedDepartment = dept"
        class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
        :class="{
          'bg-blue-600 text-white': selectedDepartment === dept,
          'bg-white text-gray-700 hover:bg-gray-100': selectedDepartment !== dept
        }"
      >
        {{ dept }}
      </button>
    </div>

    <div class="space-y-6">
      <div v-for="job in filteredJobs" :key="job.id" class="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-blue-500">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ job.title }}</h3>
              <div class="flex flex-wrap items-center gap-3 mt-1">
                <span class="text-sm text-gray-600">{{ job.department }}</span>
                <span class="text-sm text-gray-500">•</span>
                <span class="text-sm text-gray-600">{{ job.location }}</span>
                <span class="text-sm text-gray-500">•</span>
                <span class="text-sm text-gray-600">{{ job.type }}</span>
              </div>
            </div>
            <span v-if="job.isNew" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2 sm:mt-0">
              New
            </span>
          </div>
          
          <p class="text-gray-700 mb-4">{{ job.description }}</p>
          
          <div class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">Requirements:</h4>
            <ul class="list-disc list-inside space-y-1 text-gray-700">
              <li v-for="(req, index) in job.requirements" :key="index">{{ req }}</li>
            </ul>
          </div>
          
          <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Apply Now
          </button>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="text-center py-12 bg-gray-50 rounded-xl">
        <p class="text-gray-500">No open positions in this department at the moment.</p>
        <button 
          @click="selectedDepartment = 'All'" 
          class="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          View all positions
        </button>
      </div>
    </div>
  </div>
</template>
