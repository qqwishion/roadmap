from django.urls import path, include
from rest_framework.routers import DefaultRouter
from colleges.views import CollegeViewSet
from universities.views import UniversityViewSet
from companies.views import CompanyViewSet
from roadmap.views import CareerPathViewSet
from videos.views import VideoViewSet
from references.views import RegionViewSet, SpecializationViewSet, DirectionViewSet, ProfessionViewSet
from rest_framework.response import Response
from rest_framework.views import APIView

# Основной роутер
router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='colleges')
router.register(r'universities', UniversityViewSet, basename='universities')
router.register(r'companies', CompanyViewSet, basename='companies')
router.register(r'paths', CareerPathViewSet, basename='paths')  # новый путь
router.register(r'videos', VideoViewSet, basename='videos')
router.register(r'regions', RegionViewSet, basename='regions')
router.register(r'specializations', SpecializationViewSet, basename='specializations')
router.register(r'directions', DirectionViewSet, basename='directions')
router.register(r'professions', ProfessionViewSet, basename='professions')

# Legacy view для старого пути /api/roadmap/paths/
class LegacyCareerPathsView(APIView):
    def get(self, request):
        queryset = CareerPathViewSet.queryset
        serializer = CareerPathViewSet.serializer_class(queryset, many=True)
        return Response(serializer.data)

urlpatterns = [
    path('', include(router.urls)),
    path('roadmap/paths/', LegacyCareerPathsView.as_view(), name='legacy-career-paths'),
    path('', include('references.urls')),  # чтобы регионы/специализации работали
]
