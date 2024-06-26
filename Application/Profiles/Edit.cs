using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public EditProfileDto EditProfileDto { get; set; }
        }
        public class CommandValidator: AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.EditProfileDto).SetValidator(new EditProfileValidator());
            }
        }
        public class CommandHandler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public CommandHandler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return null;

                user.DisplayName = request.EditProfileDto.DisplayName;

                if(!string.IsNullOrEmpty(request.EditProfileDto.Bio))
                {
                    user.Bio = request.EditProfileDto.Bio;
                }

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to edit profile");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
