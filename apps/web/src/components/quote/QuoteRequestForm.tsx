'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Package
} from 'lucide-react';

interface QuoteEstimate {
  priceMin: number;
  priceMax: number;
  currency: string;
  recommendations: string[];
  confidence: string;
}

export function QuoteRequestForm() {
  const t = useTranslations('contact');
  const [isLoading, setIsLoading] = useState(false);
  const [estimate, setEstimate] = useState<QuoteEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productType: '',
    pipeMaterial: '',
    pipeDiameter: '',
    quantity: '',
    requirements: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEstimate(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quote');
      }

      const data = await response.json();
      setEstimate(data.estimate);

    } catch (err) {
      console.error('Quote error:', err);
      setError('Failed to generate quote. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-600">
            AI-Powered Quote System
          </span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Get Instant Price Estimate
        </h2>
        <p className="text-slate-600">
          AI analyzes 10,000+ past transactions to provide accurate pricing in 3 seconds
        </p>
      </div>

      <Card className="p-8 bg-white border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type */}
          <div>
            <Label htmlFor="productType" className="text-slate-700">
              Product Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="productType"
              name="productType"
              required
              value={formData.productType}
              onChange={handleChange}
              className="mt-2 w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <option value="">Select product type</option>
              <option value="3m-tape">3M Industrial Tape & Adhesives</option>
              <option value="3m-abrasive">3M Abrasives</option>
              <option value="3m-safety">3M Safety Equipment</option>
              <option value="exact-pipecut">EXACT Pipe Cutting Equipment</option>
              <option value="exact-consumables">EXACT Consumables (Blades, Rollers)</option>
              <option value="other">Other Products</option>
            </select>
          </div>

          {/* Pipe Cutting Specific Fields */}
          {formData.productType.includes('exact') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <Label htmlFor="pipeMaterial" className="text-slate-700">
                  Pipe Material
                </Label>
                <select
                  id="pipeMaterial"
                  name="pipeMaterial"
                  value={formData.pipeMaterial}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select material</option>
                  <option value="steel">Steel</option>
                  <option value="stainless">Stainless Steel</option>
                  <option value="plastic">Plastic</option>
                  <option value="copper">Copper</option>
                  <option value="aluminum">Aluminum</option>
                </select>
              </div>
              <div>
                <Label htmlFor="pipeDiameter" className="text-slate-700">
                  Pipe Diameter (mm)
                </Label>
                <Input
                  id="pipeDiameter"
                  name="pipeDiameter"
                  placeholder="e.g., 100-360"
                  value={formData.pipeDiameter}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="quantity" className="text-slate-700">
                  Quantity (Units)
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Quantity for other products */}
          {!formData.productType.includes('exact') && formData.productType && (
            <div>
              <Label htmlFor="quantity" className="text-slate-700">
                Quantity (Units) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                required
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          )}

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements" className="text-slate-700">
              Additional Requirements
            </Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="Project details, delivery timeline, special requirements..."
              value={formData.requirements}
              onChange={handleChange}
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-slate-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-slate-700">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="country" className="text-slate-700">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating AI Estimate...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get Instant Quote
              </>
            )}
          </Button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Estimate Result */}
        {estimate && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">
                AI Price Estimate Generated
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-slate-600 mb-1">Estimated Price Range</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {estimate.currency} {estimate.priceMin.toLocaleString()} - {estimate.priceMax.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Confidence: {estimate.confidence}
                  </p>
                </div>
              </div>

              {estimate.recommendations.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-semibold text-slate-700">
                      AI Recommendations
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {estimate.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-600 pl-6">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-green-200">
                <p className="text-sm text-slate-600">
                  Our sales team will contact you within 24 hours with a detailed official quotation.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
