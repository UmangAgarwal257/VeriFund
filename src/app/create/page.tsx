'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Handshake, ArrowLeft, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Image from 'next/image';
import { useSolPrice, solToUsd } from '@/hooks/useSolPrice';
import { useAnchorProgram, getProgramStatePda, getCampaignPda, BN } from '@/lib/anchor';
import { SystemProgram } from '@solana/web3.js';

const WalletButton = dynamic(
  () => import('@/components/WalletButton').then(mod => ({ default: mod.WalletButton })),
  { ssr: false }
);

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  goalSol: string;
  category: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  imageUrl?: string;
  goalSol?: string;
  category?: string;
}

const categories = [
  'Technology',
  'Social Impact', 
  'Creative',
  'Environment',
  'Health',
  'Community',
  'Education',
  'Business'
];

export default function CreateProjectPage() {
  const { connected, publicKey } = useWallet();
  const { price: solPrice, loading: priceLoading, error: priceError } = useSolPrice();
  const anchorProgram = useAnchorProgram();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    goalSol: '',
    category: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 64) {
      newErrors.title = 'Title must be 64 characters or less';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 512) {
      newErrors.description = 'Description must be 512 characters or less';
    }

    // Image URL validation
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (formData.imageUrl.length > 256) {
      newErrors.imageUrl = 'Image URL must be 256 characters or less';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    // Goal validation
    if (!formData.goalSol.trim()) {
      newErrors.goalSol = 'Goal amount is required';
    } else {
      const goal = parseFloat(formData.goalSol);
      if (isNaN(goal) || goal <= 0) {
        newErrors.goalSol = 'Goal must be a positive number';
      } else if (goal < 0.1) {
        newErrors.goalSol = 'Minimum goal is 0.1 SOL';
      } else if (goal > 1000000) {
        newErrors.goalSol = 'Maximum goal is 1,000,000 SOL';
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      setSubmitError('Please connect your wallet first');
      return;
    }

    if (!anchorProgram) {
      setSubmitError('Failed to initialize program connection');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { program } = anchorProgram;
      const goalLamports = Math.floor(parseFloat(formData.goalSol) * LAMPORTS_PER_SOL);
      
      // Get program state to determine next campaign ID
      const programStatePda = getProgramStatePda();
      
      let programState;
      try {
        const accountInfo = await program.provider.connection.getAccountInfo(programStatePda);
        if (!accountInfo) {
          setSubmitError('Program not initialized. Contact administrator.');
          return;
        }
        programState = await program.coder.accounts.decode('ProgramState', accountInfo.data);
      } catch {
        setSubmitError('Program not initialized. Contact administrator.');
        return;
      }

      const nextCampaignId = programState.campaignCount.toNumber() + 1;
      const campaignPda = getCampaignPda(nextCampaignId);

      console.log('Creating campaign:', {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imageUrl,
        goal: goalLamports,
        campaignId: nextCampaignId,
        creator: publicKey.toString(),
        campaignPda: campaignPda.toString()
      });

      // Call your Anchor program's create_campaign instruction
      const tx = await program.methods
        .createCampaign(
          formData.title,
          formData.description, 
          formData.imageUrl,
          new BN(goalLamports)
        )
        .accounts({
          programState: programStatePda,
          campaign: campaignPda,
          creator: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Campaign created successfully!');
      console.log('Transaction signature:', tx);
      console.log('Campaign PDA:', campaignPda.toString());
      console.log('Campaign ID:', nextCampaignId);

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          goalSol: '',
          category: ''
        });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error: unknown) {
      console.error('Error creating campaign:', error);
      
      // Parse Anchor/Solana errors for better user experience
      let errorMessage = 'Failed to create campaign. Please try again.';
      
      if (error instanceof Error && error.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient SOL for transaction fees.';
        } else if (error.message.includes('User rejected')) {
          errorMessage = 'Transaction was cancelled.';
        } else if (error.message.includes('TitleTooLong')) {
          errorMessage = 'Title is too long (max 64 characters).';
        } else if (error.message.includes('DescriptionTooLong')) {
          errorMessage = 'Description is too long (max 512 characters).';
        } else if (error.message.includes('ImageUrlTooLong')) {
          errorMessage = 'Image URL is too long (max 256 characters).';
        } else if (error.message.includes('InvalidGoalAmount')) {
          errorMessage = 'Invalid goal amount.';
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = (text: string, max: number) => (
    <span className={`text-xs ${text.length > max * 0.9 ? 'text-yellow-400' : 'text-gray-500'}`}>
      {text.length}/{max}
    </span>
  );

  const goalInUsd = formData.goalSol && !isNaN(parseFloat(formData.goalSol)) && solPrice 
    ? solToUsd(parseFloat(formData.goalSol), solPrice) 
    : '0.00';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800 bg-black/80 backdrop-blur-sm">
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
          <Link href="/create" className="text-sm font-medium text-emerald-400">
            Create
          </Link>
          <WalletButton />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Project</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Launch your project and get community backing through verified vouches
          </p>
        </div>

        {/* Connection Alert */}
        {!connected && (
          <Alert className="mb-8 bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Please connect your wallet to create a project.
            </AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {submitSuccess && (
          <Alert className="mb-8 bg-emerald-500/10 border-emerald-500/20">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="text-emerald-200">
              Project created successfully! It will appear in the projects list shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {submitError && (
          <Alert className="mb-8 bg-red-500/10 border-red-500/20">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">
              {submitError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter your project title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      maxLength={64}
                    />
                    <div className="flex justify-between">
                      {errors.title && <span className="text-red-400 text-sm">{errors.title}</span>}
                      {characterCount(formData.title, 64)}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && <span className="text-red-400 text-sm">{errors.category}</span>}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Project Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project in detail..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white min-h-32"
                      maxLength={512}
                    />
                    <div className="flex justify-between">
                      {errors.description && <span className="text-red-400 text-sm">{errors.description}</span>}
                      {characterCount(formData.description, 512)}
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Project Image URL *</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                      maxLength={256}
                    />
                    <div className="flex justify-between">
                      {errors.imageUrl && <span className="text-red-400 text-sm">{errors.imageUrl}</span>}
                      {characterCount(formData.imageUrl, 256)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload your image to a service like Imgur, Cloudinary, or IPFS and paste the URL here
                    </p>
                  </div>

                  {/* Goal Amount */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="goalSol">Funding Goal (SOL) *</Label>
                      <span className="text-xs text-gray-500">
                        {priceLoading ? (
                          "Loading price..."
                        ) : priceError ? (
                          "Price unavailable"
                        ) : solPrice ? (
                          `1 SOL ≈ $${solPrice.toFixed(2)}`
                        ) : null}
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        id="goalSol"
                        placeholder="10.5"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={formData.goalSol}
                        onChange={(e) => handleInputChange('goalSol', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white pr-12"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        SOL
                      </span>
                    </div>
                    <div className="flex justify-between">
                      {errors.goalSol && <span className="text-red-400 text-sm">{errors.goalSol}</span>}
                      {formData.goalSol && (
                        <span className="text-xs text-gray-500">
                          {priceLoading ? (
                            "Converting..."
                          ) : priceError ? (
                            `≈ $${goalInUsd} USD (estimated)`
                          ) : (
                            `≈ $${goalInUsd} USD`
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!connected || isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Project...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.imageUrl && isValidUrl(formData.imageUrl) && (
                  <div className="relative w-full h-32 bg-gray-700 rounded overflow-hidden">
                    <Image 
                      src={formData.imageUrl} 
                      alt="Project preview" 
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/400/128';
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-white">
                    {formData.title || 'Your Project Title'}
                  </h3>
                  {formData.category && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {formData.category}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-400">
                  {formData.description || 'Your project description will appear here...'}
                </p>
                
                {formData.goalSol && (
                  <div className="text-sm">
                    <span className="text-emerald-400 font-semibold">
                      Goal: {formData.goalSol} SOL
                    </span>
                    {!priceLoading && solPrice && (
                      <div className="text-xs text-gray-400 mt-1">
                        ≈ ${goalInUsd} USD
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Be clear and specific about your project goals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Include high-quality images and detailed descriptions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Set realistic funding goals</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Community vouches help build trust</span>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-emerald-500/10 border border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-emerald-400">After Creation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-emerald-200">
                <div>1. Your project will be listed publicly</div>
                <div>2. Community members can vouch for your project</div>
                <div>3. Once vouched, people can start funding</div>
                <div>4. You can withdraw funds as you reach milestones</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}