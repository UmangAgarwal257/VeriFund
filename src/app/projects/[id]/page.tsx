import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Handshake, Users,CheckCircle, Star, Shield, ArrowLeft, ExternalLink, Calendar, MapPin, Award, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SolToUsdDisplay, SolPriceIndicator } from "@/components/SolPriceDisplay"
import { useState } from "react"

// Mock project data - in real app, this would come from your Solana program
const mockProject = {
  cid: 1,
  creator: "7xKj9Rp2MwVq8uL3NzF5CdR1QaT6PbS4YeH8GmN9WvX2",
  title: "Solar-Powered Water Purification System",
  description: "Bringing clean water to rural communities using renewable solar energy technology. This system can purify 10,000 liters per day using only solar power, providing clean drinking water to communities without access to electricity or clean water sources.",
  longDescription: `Our solar-powered water purification system is designed to address the critical need for clean drinking water in remote and underserved communities. The system combines advanced filtration technology with renewable solar energy to provide a sustainable, long-term solution.

**Key Features:**
- Purifies up to 10,000 liters of water per day
- Powered entirely by solar energy with battery backup
- Removes 99.9% of bacteria, viruses, and harmful chemicals
- Low maintenance design built for rural environments
- Remote monitoring capabilities via satellite connection

**Impact:**
Each system can serve a community of 500-1000 people, providing reliable access to clean drinking water. We've already completed successful pilot programs in 3 villages, with documented health improvements and community satisfaction.`,
  imageUrl: "/api/placeholder/600/400",
  category: "Social Impact",
  goal: 50000000000, // 50k SOL in lamports
  amountRaised: 32500000000, // 32.5k SOL in lamports
  withdrawalsTotal: 5000000000, // 5k SOL withdrawn
  createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
  deadline: Date.now() + (23 * 24 * 60 * 60 * 1000),
  donors: 45,
  balance: 27500000000, // Raised - withdrawn
  isActive: true,
  vouches: 18,
  vouchScore: 4.7,
  totalStaked: 2500000000,
  location: "Kenya, East Africa",
  website: "https://watertech-solutions.org",
  milestones: [
    {
      id: 1,
      title: "Design & Engineering Complete",
      description: "Finalize system design and engineering specifications",
      targetAmount: 10000000000,
      isCompleted: true,
      completedAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
      evidence: "Technical specifications and CAD drawings completed"
    },
    {
      id: 2,
      title: "Prototype Development",
      description: "Build and test working prototype system",
      targetAmount: 15000000000,
      isCompleted: true,
      completedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
      evidence: "Prototype tested and verified in lab conditions"
    },
    {
      id: 3,
      title: "Pilot Installation",
      description: "Install and test system in first pilot community",
      targetAmount: 25000000000,
      isCompleted: false,
      isActive: true,
      evidence: null
    },
    {
      id: 4,
      title: "Full Production",
      description: "Scale to full production and additional installations",
      targetAmount: 50000000000,
      isCompleted: false,
      isActive: false,
      evidence: null
    }
  ],
  vouchers: [
    {
      address: "4mN8RqP2LwS7VtX5CjF9GdH1YeK6TbP3UoL4QtR9WvN2",
      reputation: 4.8,
      staked: 500000000,
      vouchDate: Date.now() - (3 * 24 * 60 * 60 * 1000),
      comment: "Excellent team with proven track record in water tech"
    },
    {
      address: "9pL5KqR8NwT3VmX7BjG2CdF6YeH4SzP9UoM8QtN5WvR1",
      reputation: 4.9,
      staked: 750000000,
      vouchDate: Date.now() - (2 * 24 * 60 * 60 * 1000),
      comment: "Strong technical approach and community partnerships"
    },
    {
      address: "6kJ3TqN7MwR4VpX9CjF1GdL5YeH8SzP2UoM7QtP4WvR8",
      reputation: 4.6,
      staked: 300000000,
      vouchDate: Date.now() - (1 * 24 * 60 * 60 * 1000),
      comment: "Great social impact potential"
    }
  ]
};

// Utility functions
const LAMPORTS_PER_SOL = 1_000_000_000n;
const lamportsToSol = (lamports: bigint | number) =>
  Number(typeof lamports === "bigint" ? lamports : BigInt(lamports)) / Number(LAMPORTS_PER_SOL);
const formatSol = (lamports: number) => `${lamportsToSol(lamports).toFixed(1)} SOL`;
const formatDaysLeft = (deadline: number) => Math.max(0, Math.ceil((deadline - Date.now()) / (24 * 60 * 60 * 1000)));
const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString();


export default function ProjectPage() {
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingMessage, setFundingMessage] = useState('');
  
  // In real app, fetch project data based on params.id
  const project = mockProject;
  
  if (!project) {
    notFound();
  }

  const progressPercentage = Math.min(
  100,
  (project.amountRaised / project.goal) * 100,
);
  const daysLeft = formatDaysLeft(project.deadline);
  const currentMilestone = project.milestones.find(m => m.isActive) || project.milestones.find(m => !m.isCompleted);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <Handshake className="h-5 w-5 text-black" />
          </div>
          <span className="ml-2 text-xl font-bold">VeriFund</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link href="/" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <Link href="/projects" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Projects
          </Link>
          <Link href="/create" className="text-sm font-medium hover:text-emerald-400 transition-colors">
            Create
          </Link>
          <Button variant="outline" size="sm" className="border-emerald-500/50 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
            Connect Wallet
          </Button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="space-y-6">
              <div className="relative w-full h-80 bg-gray-700 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="text-gray-400">Project Image</div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-black/50 border-gray-600 text-white">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-mono text-xs">
                      {project.creator.slice(0, 8)}...{project.creator.slice(-8)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(project.createdAt)}</span>
                  </div>
                  {project.website && (
                    <Link href={project.website} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>Website</span>
                    </Link>
                  )}
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <h3 className="text-xl font-semibold">Project Details</h3>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-line text-gray-300">
                      {project.longDescription}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                {project.milestones.map((milestone, index) => (
                  <Card key={milestone.id} className={`bg-gray-800 border-gray-700 ${milestone.isActive ? 'border-emerald-500/50' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          milestone.isCompleted ? 'bg-emerald-500' : milestone.isActive ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}>
                          {milestone.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-black" />
                          ) : (
                            <span className="text-sm font-bold text-black">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-white">{milestone.title}</h4>
                            <div className="text-right">
                              <span className="text-sm text-gray-400">
                                {formatSol(milestone.targetAmount)} target
                              </span>
                              <div className="text-xs text-gray-500">
                                <SolToUsdDisplay 
                                  solAmount={lamportsToSol(milestone.targetAmount)}
                                  showSolAmount={false}
                                  className="text-gray-500"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-400">{milestone.description}</p>
                          
                          {milestone.isCompleted && milestone.evidence && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-3">
                              <div className="text-sm text-emerald-400 font-medium mb-1">
                                Completed {milestone.completedAt
  ? formatDate(milestone.completedAt)
  : "Date N/A"}
                              </div>
                              <div className="text-sm text-gray-300">{milestone.evidence}</div>
                            </div>
                          )}
                          
                          {milestone.isActive && (
                            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                              Current Milestone
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="vouchers" className="space-y-4">
{project.vouchers.map((voucher) => (
  <Card key={voucher.address} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-black" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-gray-300">
                              {voucher.address.slice(0, 8)}...{voucher.address.slice(-8)}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm">{voucher.reputation}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {formatSol(voucher.staked)} staked
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-gray-400">{voucher.comment}</p>
                          
                          <div className="text-xs text-gray-500">
                            Vouched {formatDate(voucher.vouchDate)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="updates">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6 text-center text-gray-400">
                    <div className="space-y-2">
                      <div className="text-lg">No updates yet</div>
                      <div className="text-sm">Project creator hasn&apos;t posted any updates</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            <Card className="bg-gray-800 border-gray-700 sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Fund This Project</h3>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                    {daysLeft} days left
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">
                      {formatSol(project.amountRaised)}
                    </span>
                    <span className="text-gray-400">
                      of {formatSol(project.goal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <SolToUsdDisplay 
                      solAmount={lamportsToSol(project.amountRaised)}
                      showSolAmount={false}
                      className="text-emerald-300/70"
                    />
                    <SolToUsdDisplay 
                      solAmount={lamportsToSol(project.goal)}
                      showSolAmount={false}
                      className="text-gray-400"
                    />
                  </div>
                  
                  <Progress value={progressPercentage} className="h-3" />
                  
                  <div className="text-sm text-center text-gray-400">
                    {progressPercentage.toFixed(1)}% funded
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{project.donors}</div>
                    <div className="text-sm text-gray-400">Backers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-emerald-400">{project.vouches}</div>
                    <div className="text-sm text-gray-400">Vouches</div>
                  </div>
                </div>

                {/* Current Milestone */}
                {currentMilestone && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <div className="text-sm font-medium text-yellow-400 mb-1">Current Milestone</div>
                    <div className="text-sm text-white">{currentMilestone.title}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Target: {formatSol(currentMilestone.targetAmount)}
                      <span className="ml-2">
                        (<SolToUsdDisplay 
                          solAmount={lamportsToSol(currentMilestone.targetAmount)}
                          showSolAmount={false}
                          className="text-gray-500"
                        />)
                      </span>
                    </div>
                  </div>
                )}

                {/* Funding Form */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Amount (SOL)</label>
                      <SolPriceIndicator className="text-xs" />
                    </div>
                    <Input 
                      placeholder="0.1" 
                      type="number" 
                      min="0.01" 
                      step="0.01"
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {fundingAmount && parseFloat(fundingAmount) > 0 && (
                      <div className="text-xs text-gray-500">
                        <SolToUsdDisplay 
                          solAmount={parseFloat(fundingAmount)}
                          showSolAmount={false}
                          className="text-emerald-300/70"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message (Optional)</label>
                    <Textarea 
                      placeholder="Leave a message for the creator..."
                      value={fundingMessage}
                      onChange={(e) => setFundingMessage(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-semibold"
                  >
                    Fund Project
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    You&apos;ll need to connect your wallet to fund this project
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Score */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Community Trust
                </h3>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vouch Score</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{project.vouchScore}/5.0</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Staked</span>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-400">
                      {formatSol(project.totalStaked)}
                    </span>
                    <div className="text-xs text-gray-500">
                      <SolToUsdDisplay 
                        solAmount={lamportsToSol(project.totalStaked)}
                        showSolAmount={false}
                        className="text-gray-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vouchers</span>
                  <span className="font-semibold">{project.vouches}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Handshake className="w-4 h-4 mr-2" />
                  Vouch for Project
                </Button>
              </CardContent>
            </Card>

            {/* Risk Warning */}
            <Card className="bg-red-500/10 border border-red-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-red-400">Investment Risk</div>
                    <div className="text-xs text-gray-400">
                      Crowdfunding involves risk. Only invest what you can afford to lose. 
                      Past performance doesn&apos;t guarantee future results.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}